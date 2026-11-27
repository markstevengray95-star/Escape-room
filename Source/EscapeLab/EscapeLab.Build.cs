using UnrealBuildTool;
public class EscapeLab : ModuleRules {
 public EscapeLab(ReadOnlyTargetRules Target) : base(Target) {
  PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
  PublicDependencyModuleNames.AddRange(new string[] {"Core","CoreUObject","Engine","InputCore"});
 }
}
