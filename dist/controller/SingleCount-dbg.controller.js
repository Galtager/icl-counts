sap.ui.define(["sap/ui/core/UIComponent", "./BaseController"], function (UIComponent, __BaseController) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace ICL.InventoryCount.controller
   */
  const SingleCount = BaseController.extend("ICL.InventoryCount.controller.SingleCount", {
    onInit: function _onInit() {
      BaseController.prototype.onInit.call(this);
      const oRouter = UIComponent.getRouterFor(this);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("singleCount").attachMatched(this._initialFunc, this);
    },
    onAfterRendering: function _onAfterRendering() {
      this.searchFieldExpand('countSF');
    },
    _initialFunc: function _initialFunc(oEvent) {
      const countModel = this.getCountsModel();
      countModel.setProperty('/oMaintain/title', myComponent.i18n('countTitle'));
      this.arguments = oEvent.getParameter("arguments");
      const items = countModel.getProperty('/oData/countItems');
      if (!items) this.loadCount(countModel);
    },
    loadCount: function _loadCount(countModel) {
      const selCount = countModel.getProperty('/oMaintain/selCount');
      if (!selCount) {
        this.fetchCount(countModel);
      }
      this.fetchItems(countModel);
    },
    fetchItems: function _fetchItems(countModel) {
      void fetch("/mockData/itemsInCounts.JSON").then(res => res.json()).then(data => {
        const fetchedCount = data.filter(order => order.countId === this.arguments.id);
        countModel.setProperty('/oData/countItems', fetchedCount);
      });
    },
    fetchCount: function _fetchCount(countModel) {
      void fetch("/mockData/CountsList.JSON").then(res => res.json()).then(data => {
        const fetchedCount = data.find(order => order.id === this.arguments.id);
        countModel.setProperty('/oMaintain/selCount', fetchedCount);
      });
    },
    toggleLongDesc: function _toggleLongDesc(oEvent) {
      const pathToToggle = oEvent.getSource().getBindingContext('CountsModel').getPath();
      this.toggleInfo(oEvent, `${pathToToggle}/collapse`);
    },
    onChangeAmount: function _onChangeAmount(oEvent) {
      const pathToUpdate = oEvent.getSource().getBindingContext('CountsModel').getPath();
      const countModel = this.getCountsModel();
      const newValue = oEvent.getParameter('newValue');
      countModel.setProperty(`${pathToUpdate}/count`, newValue);
    },
    openItemDetails: async function _openItemDetails(oEvent) {
      const itemSelected = oEvent.getSource().getBindingContext('CountsModel').getObject();
      const countModel = this.getCountsModel();
      const itemDetails = await this.fetchItemDetails(itemSelected.itemNum);
      countModel.setProperty('/oData/itemDetails', itemDetails);
      void this.onFragmentHandler(oEvent, 'Dialog_itemDetails', true);
    },
    fetchItemDetails: function _fetchItemDetails(selectedId) {
      return fetch("/mockData/itemDetails.JSON").then(res => res.json()).then(data => {
        return data.find(item => item.itemNum === selectedId);
      });
    },
    openAttchment: function _openAttchment(oEvent) {
      alert('open attachment');
    },
    openFooterScan: function _openFooterScan(oEvent) {
      this.onQRScanner(oEvent);
    },
    onEndCountDialog: function _onEndCountDialog(oEvent) {
      const countModel = this.getCountsModel();
      const items = countModel.getProperty('/oData/countItems');
      const countedItems = items.filter(item => item.approve);
      countModel.setProperty('/oMaintain/countedItems', countedItems);
      void this.onFragmentHandler(oEvent, 'Dialog_endCount', true);
    },
    onEndCountProccess: function _onEndCountProccess() {
      // make post requiest and update sap
      // then
      this.navTo('endCount');
    },
    approveItem: function _approveItem(oEvent) {
      const countModel = this.getCountsModel();
      const selItemPath = oEvent.getSource().getBindingContext('CountsModel').getPath();
      countModel.setProperty(`${selItemPath}/approve`, true);
    },
    choosePersonalNumber: function _choosePersonalNumber(oEvent) {
      const selItemPath = oEvent.getSource().getBindingContext('CountsModel').getPath();
      const countModel = this.getCountsModel();
      countModel.setProperty('/oMaintain/selItemForPN', selItemPath);
      this.navTo('personalNumbers');
    }
  });
  return SingleCount;
});
//# sourceMappingURL=SingleCount.controller.js.map