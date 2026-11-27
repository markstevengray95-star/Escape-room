#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "GameFramework/GameModeBase.h"
#include "GameFramework/HUD.h"
#include "GameFramework/Actor.h"
#include "EscapePrototype.generated.h"

class UCameraComponent;
class UStaticMeshComponent;
class UStaticMesh;

UENUM()
enum class EEscapeObject : uint8 { Drawer, Clue, Switch, Door, Exit };

UCLASS()
class AEscapeObject : public AActor {
 GENERATED_BODY()
public:
 AEscapeObject();
 virtual void Tick(float DeltaSeconds) override;
 void Configure(EEscapeObject InKind, UStaticMesh* Shape, FVector Size, FLinearColor Color);
 void Use(class AEscapePlayer* Player);
 FString Prompt() const;
 UPROPERTY(VisibleAnywhere) TObjectPtr<UStaticMeshComponent> Mesh;
private:
 EEscapeObject Kind = EEscapeObject::Clue;
 bool bOpen = false;
 FVector ClosedLocation;
 FVector TargetLocation;
};

UCLASS()
class AEscapePlayer : public ACharacter {
 GENERATED_BODY()
public:
 AEscapePlayer();
 virtual void SetupPlayerInputComponent(UInputComponent* Input) override;
 AEscapeObject* LookAtObject() const;
 void Notify(const FString& Text);
 FString Status() const;
 FString Inventory() const;
 bool bHasClue = false;
 bool bPowerRestored = false;
 bool bEscaped = false;
private:
 UPROPERTY(VisibleAnywhere) TObjectPtr<UCameraComponent> Camera;
 FString Message;
 double MessageUntil = 0;
 void Forward(float Value);
 void Right(float Value);
 void Turn(float Value);
 void Look(float Value);
 void Interact();
};

UCLASS()
class AEscapeHUD : public AHUD {
 GENERATED_BODY()
public:
 virtual void DrawHUD() override;
};

UCLASS()
class AEscapeGameMode : public AGameModeBase {
 GENERATED_BODY()
public:
 AEscapeGameMode();
 virtual void InitGame(const FString& MapName, const FString& Options, FString& ErrorMessage) override;
private:
 void BuildRoom();
};
