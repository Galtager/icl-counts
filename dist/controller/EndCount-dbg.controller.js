sap.ui.define(["sap/ui/core/UIComponent", "./BaseController"], function (UIComponent, __BaseController) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace ICL.InventoryCount.controller
   */
  const EndCount = BaseController.extend("ICL.InventoryCount.controller.EndCount", {
    onInit: function _onInit() {
      BaseController.prototype.onInit.call(this);
      const oRouter = UIComponent.getRouterFor(this);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("endCount").attachMatched(this._initialFunc, this);
    },
    _initialFunc: function _initialFunc(oEvent) {
      const countModel = this.getCountsModel();
      countModel.setProperty('/oMaintain/title', myComponent.i18n('endCount'));
      const countedItems = countModel.getProperty('/oMaintain/countedItems');
      // if (!countedItems) {
      //     this.onNavBack()
      // }
    },
    acceptCount: function _acceptCount(oEvent) {
      void this.onFragmentHandler(oEvent, 'Dialog_Success', true);
    },
    cancelDlt: function _cancelDlt(oEvent) {
      const countModel = this.getCountsModel();
      const countedItems = countModel.getProperty('/oMaintain/countedItems');
      countedItems.map(el => delete el.deleteState);
      this.toggleInfo(oEvent, '/oFlags/endCountEdit');
    },
    deleteitems: function _deleteitems(oEvent) {
      const countModel = this.getCountsModel();
      const countedItems = countModel.getProperty('/oMaintain/countedItems');
      const remainItems = countedItems.filter(el => !el.deleteState);
      countModel.setProperty('/oMaintain/countedItems', remainItems);
      this.toggleInfo(oEvent, '/oFlags/endCountEdit');
    }
  });
  return EndCount;
});
//# sourceMappingURL=EndCount.controller.js.map