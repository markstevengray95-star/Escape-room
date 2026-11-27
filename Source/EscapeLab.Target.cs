using UnrealBuildTool;
using System.Collections.Generic;
public class EscapeLabTarget : TargetRules {
 public EscapeLabTarget(TargetInfo Target) : base(Target) {
  Type = TargetType.Game; DefaultBuildSettings = BuildSettingsVersion.V5;
  ExtraModuleNames.Add("EscapeLab");
 }
}
