sap.ui.define(["sap/ui/core/UIComponent", "./BaseController"], function (UIComponent, __BaseController) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace ICL.InventoryCount.controller
   */
  const PersonalNumbers = BaseController.extend("ICL.InventoryCount.controller.PersonalNumbers", {
    onInit: function _onInit() {
      const oRouter = UIComponent.getRouterFor(this);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("personalNumbers").attachMatched(this._initialFunc, this);
    },
    _initialFunc: function _initialFunc() {
      const countModel = this.getCountsModel();
      const selectedItemPath = countModel.getProperty('/oMaintain/selItemForPN');
      const selectedItem = countModel.getProperty(selectedItemPath);
      const DeppClone = structuredClone(selectedItem);
      if (DeppClone) {
        if (!DeppClone.personalNums) DeppClone.personalNums = new Array(+DeppClone.count);
        countModel.setProperty('/oMaintain/tempSelectedItem', DeppClone);
      } else {
        this.onNavBack();
      }
    },
    savePersonalNumbers: function _savePersonalNumbers() {
      const countModel = this.getCountsModel();
      const selectedItemPath = countModel.getProperty('/oMaintain/selItemForPN');
      const itemModified = countModel.getProperty('/oMaintain/tempSelectedItem');
      const DeppClone = structuredClone(itemModified);
      DeppClone.approve = true;
      countModel.setProperty(selectedItemPath, DeppClone);
      this.onNavBack();
    },
    changeNumber: function _changeNumber(oEvent) {
      const pathToUpdate = oEvent.getSource().getBindingContext('CountsModel').getPath();
      const countModel = this.getCountsModel();
      const newValue = oEvent.getParameter('newValue');
      countModel.setProperty(pathToUpdate, newValue);
    }
  });
  return PersonalNumbers;
});
//# sourceMappingURL=PersonalNumbers.controller.js.map