#include "EscapePrototype.h"
#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Components/InputComponent.h"
#include "Components/PointLightComponent.h"
#include "Engine/Canvas.h"
#include "Engine/Engine.h"
#include "Engine/StaticMesh.h"
#include "Engine/StaticMeshActor.h"
#include "Engine/PointLight.h"
#include "Engine/World.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/PlayerStart.h"
#include "GameFramework/PlayerController.h"
#include "Materials/MaterialInstanceDynamic.h"

namespace {
 void Tint(UStaticMeshComponent* Mesh, FLinearColor Color) {
  if (auto* Base = LoadObject<UMaterialInterface>(nullptr,TEXT("/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"))) {
   if (auto* Mat = Mesh->CreateDynamicMaterialInstance(0, Base)) Mat->SetVectorParameterValue(TEXT("Color"),Color);
  }
 }
}

AEscapeObject::AEscapeObject() {
 PrimaryActorTick.bCanEverTick = true;
 Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
 SetRootComponent(Mesh);
 Mesh->SetMobility(EComponentMobility::Movable);
 Mesh->SetCollisionProfileName(TEXT("BlockAllDynamic"));
}
void AEscapeObject::Configure(EEscapeObject InKind, UStaticMesh* Shape, FVector Size, FLinearColor Color) {
 Kind=InKind; Mesh->SetStaticMesh(Shape); Mesh->SetRelativeScale3D(Size/100.f);
 Tint(Mesh,Color); ClosedLocation=TargetLocation=GetActorLocation();
}
void AEscapeObject::Tick(float Dt) {
 Super::Tick(Dt);
 if (!GetActorLocation().Equals(TargetLocation,0.1f)) {
  SetActorLocation(FMath::VInterpConstantTo(GetActorLocation(),TargetLocation,Dt,220.f));
 }
}
FString AEscapeObject::Prompt() const {
 switch(Kind) {
 case EEscapeObject::Drawer: return bOpen ? TEXT("Close drawer") : TEXT("Open drawer");
 case EEscapeObject::Clue: return TEXT("Collect laboratory note");
 case EEscapeObject::Switch: return TEXT("Restore power");
 case EEscapeObject::Door: return bOpen ? TEXT("Door unlocked") : TEXT("Unlock security door");
 case EEscapeObject::Exit: return TEXT("Activate exit terminal");
 }
 return TEXT("");
}
void AEscapeObject::Use(AEscapePlayer* P) {
 if (!IsValid(P) || P->bEscaped) return;
 switch(Kind) {
 case EEscapeObject::Drawer:
  bOpen=!bOpen; TargetLocation=ClosedLocation+(bOpen?FVector(145,0,0):FVector::ZeroVector);
  P->Notify(bOpen?TEXT("Drawer opened. Inspect the note behind it."):TEXT("Drawer closed.")); break;
 case EEscapeObject::Clue:
  P->bHasClue=true; P->Notify(TEXT("Note collected: restore the breaker, then open the security door.")); Destroy(); break;
 case EEscapeObject::Switch:
  P->bPowerRestored=true; Tint(Mesh,FLinearColor(0.05f,0.8f,0.2f)); P->Notify(TEXT("Power restored.")); break;
 case EEscapeObject::Door:
  if (bOpen) break;
  if (!P->bHasClue || !P->bPowerRestored) { P->Notify(TEXT("Locked: find the note and restore power.")); break; }
  bOpen=true; TargetLocation=ClosedLocation+FVector(0,0,260);
  P->Notify(TEXT("Security door unlocked. Reach the exit terminal.")); break;
 case EEscapeObject::Exit:
  if (P->bHasClue && P->bPowerRestored) { P->bEscaped=true; P->Notify(TEXT("ESCAPED! Laboratory prototype complete.")); }
  else P->Notify(TEXT("Security systems are still locked."));
  break;
 }
}

AEscapePlayer::AEscapePlayer() {
 GetCapsuleComponent()->InitCapsuleSize(34,88);
 Camera=CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
 Camera->SetupAttachment(GetCapsuleComponent());
 Camera->SetRelativeLocation(FVector(0,0,64));
 Camera->bUsePawnControlRotation=true;
 bUseControllerRotationYaw=true;
 GetCharacterMovement()->bOrientRotationToMovement=false;
 GetCharacterMovement()->MaxWalkSpeed=380;
 GetCharacterMovement()->JumpZVelocity=350;
}
void AEscapePlayer::SetupPlayerInputComponent(UInputComponent* I) {
 Super::SetupPlayerInputComponent(I);
 I->BindAxis(TEXT("MoveForward"),this,&AEscapePlayer::Forward);
 I->BindAxis(TEXT("MoveRight"),this,&AEscapePlayer::Right);
 I->BindAxis(TEXT("Turn"),this,&AEscapePlayer::Turn);
 I->BindAxis(TEXT("LookUp"),this,&AEscapePlayer::Look);
 I->BindAction(TEXT("Interact"),IE_Pressed,this,&AEscapePlayer::Interact);
 I->BindAction(TEXT("Jump"),IE_Pressed,this,&ACharacter::Jump);
 I->BindAction(TEXT("Jump"),IE_Released,this,&ACharacter::StopJumping);
}
void AEscapePlayer::Forward(float V){ if(!bEscaped) AddMovementInput(GetActorForwardVector(),V); }
void AEscapePlayer::Right(float V){ if(!bEscaped) AddMovementInput(GetActorRightVector(),V); }
void AEscapePlayer::Turn(float V){ AddControllerYawInput(V); }
void AEscapePlayer::Look(float V){ AddControllerPitchInput(V); }
AEscapeObject* AEscapePlayer::LookAtObject() const {
 FHitResult Hit;
 FCollisionQueryParams Params(SCENE_QUERY_STAT(EscapeInteraction),false,this);
 const FVector Start=Camera->GetComponentLocation();
 if (GetWorld()->LineTraceSingleByChannel(Hit,Start,Start+Camera->GetForwardVector()*260.f,ECC_Visibility,Params))
  return Cast<AEscapeObject>(Hit.GetActor());
 return nullptr;
}
void AEscapePlayer::Interact(){ if(auto* Obj=LookAtObject()) Obj->Use(this); }
void AEscapePlayer::Notify(const FString& Text){ Message=Text; MessageUntil=GetWorld()->GetTimeSeconds()+6; }
FString AEscapePlayer::Status() const {
 if(bEscaped) return TEXT("ESCAPED! Stop and restart Play to try again.");
 return GetWorld()->GetTimeSeconds()<MessageUntil?Message:TEXT("Explore the lab. Find a note, restore power and escape.");
}
FString AEscapePlayer::Inventory() const {
 return FString::Printf(TEXT("NOTE: %s     POWER: %s"),bHasClue?TEXT("Collected"):TEXT("Missing"),bPowerRestored?TEXT("Online"):TEXT("Offline"));
}

void AEscapeHUD::DrawHUD() {
 Super::DrawHUD();
 auto* P=Cast<AEscapePlayer>(GetOwningPawn()); if(!Canvas || !P) return;
 UFont* Font=GEngine?GEngine->GetSmallFont():nullptr;
 float W=Canvas->SizeX,H=Canvas->SizeY;
 DrawRect(FLinearColor(0.015f,0.025f,0.04f,0.9f),16,16,FMath::Min(W-32,610.f),90);
 DrawText(TEXT("ESCAPE LAB  /  LABORATORY LOCKDOWN"),FLinearColor(0.25f,0.9f,0.9f),28,26,Font,1.35f);
 DrawText(P->Inventory(),FLinearColor::White,28,53,Font,1.15f);
 DrawText(TEXT("WASD / arrows: move    Mouse: look    E: interact"),FLinearColor::White,28,77,Font,1.f);
 DrawLine(W/2-5,H/2,W/2+5,H/2,FLinearColor::White,1.5f);
 DrawLine(W/2,H/2-5,W/2,H/2+5,FLinearColor::White,1.5f);
 if(auto* O=P->LookAtObject()) DrawText(TEXT("[E] ")+O->Prompt(),FLinearColor::Yellow,W/2-95,H/2+24,Font,1.3f);
 DrawRect(FLinearColor(0.015f,0.025f,0.04f,0.9f),16,H-66,W-32,50);
 DrawText(P->Status(),FLinearColor::White,28,H-54,Font,1.15f);
}
AEscapeGameMode::AEscapeGameMode(){ DefaultPawnClass=AEscapePlayer::StaticClass(); HUDClass=AEscapeHUD::StaticClass(); }
void AEscapeGameMode::InitGame(const FString& MapName,const FString& Options,FString& ErrorMessage) {
 Super::InitGame(MapName,Options,ErrorMessage); BuildRoom();
}
void AEscapeGameMode::BuildRoom() {
 UWorld* World=GetWorld();
 auto* Cube=LoadObject<UStaticMesh>(nullptr,TEXT("/Engine/BasicShapes/Cube.Cube"));
 if(!World || !Cube) return;
 const FLinearColor Wall(0.22f,0.32f,0.38f), Floor(0.18f,0.22f,0.25f), Bench(0.35f,0.44f,0.48f);
 auto Block=[&](FVector Pos,FVector Size,FLinearColor Color) {
  auto* A=World->SpawnActor<AStaticMeshActor>(Pos,FRotator::ZeroRotator);
  if(A){ auto* M=A->GetStaticMeshComponent(); M->SetMobility(EComponentMobility::Movable); M->SetStaticMesh(Cube); M->SetRelativeScale3D(Size/100.f); M->SetCollisionProfileName(TEXT("BlockAll")); Tint(M,Color); }
 };
 auto Object=[&](EEscapeObject Kind,FVector Pos,FVector Size,FLinearColor Color) {
  auto* A=World->SpawnActor<AEscapeObject>(Pos,FRotator::ZeroRotator);
  if(A) A->Configure(Kind,Cube,Size,Color);
 };
 // Main room and exit corridor. Centimetres; floor surface at Z=0.
 Block({100,0,-15},{1200,800,30},Floor);
 Block({100,-400,160},{1200,20,320},Wall); Block({100,400,160},{1200,20,320},Wall);
 Block({-500,0,160},{20,800,320},Wall); Block({700,0,160},{20,800,320},Wall);
 Block({400,-250,160},{20,300,320},Wall); Block({400,250,160},{20,300,320},Wall);
 Block({400,0,280},{20,200,80},Wall);
 Object(EEscapeObject::Door,{400,0,110},{22,196,220},{0.2f,0.45f,0.55f});
 // Cabinet and note: drawer initially occludes the note from the room-facing side.
 Block({-140,-315,45},{140,100,90},Bench);
 Block({-140,-350,115},{140,16,50},Bench);
 Object(EEscapeObject::Drawer,{-140,-285,110},{135,26,48},{0.35f,0.5f,0.55f});
 Object(EEscapeObject::Clue,{-140,-325,122},{38,10,22},{0.95f,0.85f,0.35f});
 Block({100,305,50},{150,130,100},Bench);
 Object(EEscapeObject::Switch,{100,305,135},{45,35,60},{0.8f,0.12f,0.08f});
 Block({620,0,45},{85,110,90},Bench);
 Object(EEscapeObject::Exit,{620,0,130},{55,65,70},{0.08f,0.65f,0.55f});
 // Benches and ceiling lights with no downloaded asset dependency.
 for (float X : {-300.f,100.f,550.f}) {
  if(auto* L=World->SpawnActor<APointLight>(FVector(X,0,265),FRotator::ZeroRotator)){
   auto* C=Cast<UPointLightComponent>(L->GetLightComponent()); if(!C) continue; C->SetMobility(EComponentMobility::Movable);
   C->SetIntensity(6500); C->SetAttenuationRadius(850); C->SetLightColor(FLinearColor(0.78f,0.9f,1.f));
  }
 }
 World->SpawnActor<APlayerStart>(FVector(-340,0,100),FRotator::ZeroRotator);
}
