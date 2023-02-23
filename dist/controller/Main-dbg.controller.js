sap.ui.define(["sap/ui/core/UIComponent", "./BaseController"], function (UIComponent, __BaseController) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace ICL.InventoryCount.controller
   */
  const Main = BaseController.extend("ICL.InventoryCount.controller.Main", {
    onInit: function _onInit() {
      BaseController.prototype.onInit.call(this);
      const oRouter = UIComponent.getRouterFor(this);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("main").attachMatched(this._initialFunc, this);
    },
    onAfterRendering: function _onAfterRendering() {
      this.searchFieldExpand('countsListSF');
    },
    _initialFunc: function _initialFunc() {
      const countModel = this.getCountsModel();
      countModel.setProperty('/oMaintain/title', myComponent.i18n('InvCountTitle'));
      countModel.setProperty('/oFlags/headerNavBack', false);
      this.loadCounts(countModel);
    },
    loadCounts: function _loadCounts(countModel) {
      void fetch("/mockData/CountsList.JSON").then(res => res.json()).then(data => countModel.setProperty('/oData/CountsList', data));
    },
    onPressCount: function _onPressCount(oEvent, countObj) {
      const countModel = this.getCountsModel();
      countModel.setProperty('/oMaintain/selCount', countObj);
      this.fetchItems(countModel, countObj.id);
      this.navTo('signature');
    },
    fetchItems: function _fetchItems(countModel, countId) {
      void fetch("/mockData/itemsInCounts.JSON").then(res => res.json()).then(data => {
        const fetchedCount = data.filter(order => order.countId === countId);
        countModel.setProperty('/oData/countItems', fetchedCount);
      });
    }
  });
  return Main;
});
//# sourceMappingURL=Main.controller.js.map