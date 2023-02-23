sap.ui.define(["sap/ui/core/IconPool"], function (IconPool) {
  var __exports = {
    textMissing(text) {
      return !!text && text || 'חסר';
    },
    textMissingParts(text, text2) {
      return !!text && `${text} ${text2}` || 'חסר';
    },
    accessImage(accessType) {
      switch (accessType) {
        case 'forklift':
          return '../images/forklift.png';
        case 'melaket':
          return '../images/melaket.png';
        case 'ladder':
          return '../images/melaket.png';
      }
    },
    accessDesc(accessType) {
      switch (accessType) {
        case 'forklift':
          return 'מלגזה';
        case 'melaket':
          return 'מלקטת';
        case 'ladder':
          return 'סולם';
      }
    },
    getIconForMimeType(sMimeType) {
      return IconPool.getIconForMimeType(sMimeType);
    }
  };
  return __exports;
});
//# sourceMappingURL=formatter.js.map