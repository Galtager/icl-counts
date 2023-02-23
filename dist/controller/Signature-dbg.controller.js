sap.ui.define(["sap/ui/core/UIComponent", "./BaseController"], function (UIComponent, __BaseController) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace ICL.InventoryCount.controller
   */
  const EndCountForm = BaseController.extend("ICL.InventoryCount.controller.EndCountForm", {
    onInit: function _onInit() {
      BaseController.prototype.onInit.call(this);
      const oRouter = UIComponent.getRouterFor(this);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("signature").attachMatched(this._initialFunc, this);
    },
    onAfterRendering: function _onAfterRendering() {
      const vbox = this.getView().byId('signaturePad');
      const signaturePad = vbox.getItems()[0];
      signaturePad.attachBrowserEvent('touchend', () => {
        const countModel = this.getCountsModel();
        countModel.setProperty('/oMaintain/signature', true);
      });
    },
    _initialFunc: function _initialFunc() {
      const countModel = this.getCountsModel();
      countModel.setProperty('/oMaintain/title', myComponent.i18n('startCountTitle'));
      countModel.setProperty('/oFlags/headerNavBack', true);
      const selCount = countModel.getProperty('/oMaintain/selCount');
      if (!selCount) this.onNavBack();
    },
    sendCount: function _sendCount(oEvent) {
      const countModel = this.getCountsModel();
      const selCount = countModel.getProperty('/oMaintain/selCount');
      // call post serivce
      this.navToCount(oEvent, selCount.id);
    },
    cleanSign: function _cleanSign(oEvent) {
      const countModel = this.getCountsModel();
      countModel.setProperty('/oMaintain/countedForm/signature', true);
      const VBox = this.getView().byId('signaturePad');
      const signaturePad = VBox.getItems()[0];
      signaturePad.clear();
      countModel.setProperty('/oMaintain/signature', false);
    }
  });
  return EndCountForm;
});
//# sourceMappingURL=Signature.controller.js.map