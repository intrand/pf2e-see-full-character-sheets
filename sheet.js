// helpful: CONFIG.debug.hooks = true

Hooks.once('ready', function () {
  const moduleId = "pf2e-see-full-character-sheets";
  const targetPath = "CONFIG.Actor.sheetClasses.character['pf2e.CharacterSheetPF2e'].cls.prototype.template";
  const templateOverride = function () {
    const limitedSheet = "systems/pf2e/templates/actors/character/limited.hbs";
    const fullSheet = "systems/pf2e/templates/actors/character/sheet.hbs";

    // check for non-characters (should never happen)
    if (this.actor.type != "character") {
      console.log(`PF2E See Full Character Sheets | Returning limited sheet for actor: ${this.actor.name}`);
      return limitedSheet;
    };

    // return full sheet if the player owns the actor
    if (this.actor.isOwner) {
      console.log(`PF2E See Full Character Sheets | Returning full sheet for actor: ${this.actor.name}`);
      return fullSheet;
    };

    // return full sheet if player is observer permission or higher
    if (this.actor.permission > 1) {
      console.log(`PF2E See Full Character Sheets | Returning full sheet for actor: ${this.actor.name}`);
      return fullSheet;
    };

    // return full sheet for only members of the active party
    for (const party of this.actor.parties) {
      if (party.active) {
        console.log(`PF2E See Full Character Sheets | Returning full sheet for actor: ${this.actor.name}`);
        return fullSheet;
      };
    };

    // default to the limited sheet
    console.log(`PF2E See Full Character Sheets | Returning limited sheet for actor: ${this.actor.name}`);
    return limitedSheet;
  };

  try {
    libWrapper.register(
      moduleId,         // module id
      targetPath,       // path to the getter method
      templateOverride, // method returning static value
      "OVERRIDE"        // replace method
    );
    console.log("PF2E See Full Character Sheets | Successfully registered template override with libWrapper.");
  } catch (e) {
    console.error("PF2E See Full Character Sheets | Failed to register template override with libWrapper:", e);
  };
});
