sap.ui.define(["./BaseController", "sap/ui/core/UIComponent", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (__BaseController, UIComponent, Filter, FilterOperator) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace ICL.InventoryCount.controller
   */
  const CreateCount = BaseController.extend("ICL.InventoryCount.controller.CreateCount", {
    onInit: function _onInit() {
      BaseController.prototype.onInit.call(this);
      const oRouter = UIComponent.getRouterFor(this);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("createCount").attachMatched(this._initialFunc, this);
    },
    onAfterRendering: function _onAfterRendering() {
      this.searchFieldExpand('fromSF');
      this.searchFieldExpand('toSF');
    },
    _initialFunc: function _initialFunc(oEvent) {
      const countModel = this.getCountsModel();
      this.initModelState(countModel);
      this.fetchItems(countModel);
      this.fetchLoactions(countModel);
      countModel.setProperty('/oMaintain/title', myComponent.i18n('createCount'));
      countModel.setProperty('/oFlags/headerNavBack', true);
    },
    initModelState: function _initModelState(countModel) {
      countModel.setProperty('/oMaintain/createCount/tabKey', '1');
      countModel.setProperty('/oMaintain/createCount/currStep', '1');
      countModel.setProperty('/oFlags/iturSearch', false);
      countModel.setProperty('/oMaintain/createCount/newItems', []);
    },
    fetchItems: function _fetchItems(countModel) {
      void fetch("/mockData/itemsInCounts.JSON").then(res => res.json()).then(data => {
        countModel.setProperty('/oData/itemsToAdd', data);
      });
    },
    fetchLoactions: function _fetchLoactions(countModel) {
      countModel.setProperty('/oData/locations', [{
        key: "I01/I01"
      }, {
        key: "I01/I02"
      }, {
        key: "I01/I03"
      }, {
        key: "I01/I04"
      }, {
        key: "I01/I05"
      }, {
        key: "I01/I06"
      }, {
        key: "I01/I07"
      }, {
        key: "I01/I08"
      }]);
    },
    searchFieldExpand: function _searchFieldExpand(searchFieldId) {
      const countModel = this.getCountsModel();
      const searchField = this.getView().byId(searchFieldId);
      searchField.attachBrowserEvent('focusin', () => {
        // save old values
        const iturSearchState = countModel.getProperty('/oFlags/iturSearch');
        if (!iturSearchState) {
          countModel.setProperty('/oMaintain/createCount/oldToSF', countModel.getProperty('/oMaintain/createCount/toSF') || "");
          countModel.setProperty('/oMaintain/createCount/oldFromSF', countModel.getProperty('/oMaintain/createCount/fromSF') || "");
        }
        countModel.setProperty('/oFlags/iturSearchFocus', searchFieldId);
        countModel.setProperty('/oFlags/iturSearch', true);
      });
    },
    returnFromLocateSeacrh: function _returnFromLocateSeacrh() {
      const countModel = this.getCountsModel();
      countModel.setProperty('/oFlags/iturSearch', false);
      countModel.setProperty('/oMaintain/createCount/toSF', countModel.getProperty('/oMaintain/createCount/oldToSF'));
      countModel.setProperty('/oMaintain/createCount/fromSF', countModel.getProperty('/oMaintain/createCount/oldFromSF'));
    },
    acceptLocate: function _acceptLocate(oEvent) {
      const countModel = this.getCountsModel();
      countModel.setProperty('/oFlags/iturSearch', false);
      const from = countModel.getProperty('/oMaintain/createCount/fromSF');
      const to = countModel.getProperty('/oMaintain/createCount/toSF');
      const itemsList = this.getView().byId('itemsToAdd'),
        oBinding = itemsList.getBinding("items"),
        aFilter = [new Filter('storageLoc', FilterOperator.BT, from, to)];
      if (!!from && !!to) oBinding.filter(aFilter);else oBinding.filter(null);
    },
    selectLocation: function _selectLocation(oEvent) {
      const countModel = this.getCountsModel();
      const selItem = oEvent.getSource().getBindingContext('CountsModel').getObject();
      const focusedInput = countModel.getProperty('/oFlags/iturSearchFocus');
      countModel.setProperty(`/oMaintain/createCount/${focusedInput}`, selItem.key);
      if (focusedInput === 'fromSF') this.getView().byId('toSF').focus();
    },
    checkSelected: function _checkSelected(oEvent) {
      const countModel = this.getCountsModel();
      if (!oEvent.getParameter('selected')) {
        // check there is some selected
        const items = countModel.getProperty('/oData/itemsToAdd');
        const atLeastOne = items.find(item => item.selected);
        countModel.setProperty('/oFlags/itemsToAddSelected', !!atLeastOne);
      } else {
        countModel.setProperty('/oFlags/itemsToAddSelected', true);
      }
    },
    checkDelete: function _checkDelete(oEvent) {
      const countModel = this.getCountsModel();
      if (!oEvent.getParameter('selected')) {
        // check there is some selected
        const items = countModel.getProperty('/oMaintain/createCount/newItems');
        const atLeastOne = items.find(item => item.deleteState);
        countModel.setProperty('/oFlags/itemsToDelete', !!atLeastOne);
      } else {
        countModel.setProperty('/oFlags/itemsToDelete', true);
      }
    },
    addToList: function _addToList() {
      const countModel = this.getCountsModel();
      const items = countModel.getProperty('/oData/itemsToAdd');
      const selectedItems = items.filter(item => item.selected);
      countModel.setProperty('/oMaintain/createCount/newItems', selectedItems);
      countModel.setProperty('/oMaintain/createCount/tabKey', '2');
    },
    removeFromList: function _removeFromList() {
      const countModel = this.getCountsModel();
      const items = countModel.getProperty('/oMaintain/createCount/newItems');
      const deleteItems = items.filter(item => !item.deleteState);
      countModel.setProperty('/oMaintain/createCount/newItems', deleteItems);
    },
    onCreateCount: function _onCreateCount() {
      const countModel = this.getCountsModel();
      countModel.setProperty('/oMaintain/createCount/currStep', '2');
      // post request to get the new created count
      countModel.setProperty('/oData/createdCount', {
        id: '1234567890'
      });
    },
    onStartCount: function _onStartCount(oEvent) {
      const countModel = this.getCountsModel();
      const createdCount = countModel.getProperty('/oData/createdCount');
      this.navToCount(oEvent, createdCount.id);
    }
  });
  return CreateCount;
});
//# sourceMappingURL=CreateCount.controller.js.map