import axios from "axios";

export default (tenant, service, token) => {
    return {
        /******************************************************************************************************/
        /* ALL FUNCTIONS FOR PRODUCTS REPORTS ----------------------------------------------------------------*/
        /******************************************************************************************************/
        listAllProducts() {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/generalReport/${tenant}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },
        
        labels(labelList) {
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/labels`, labelList, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        /******************************************************************************************************/
        /* ALL FUNCTIONS FOR SALE REPORTS --------------------------------------------------------------------*/
        /******************************************************************************************************/
        onCloseSaleReport(object) {
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/onCloseSaleReport/${tenant}`, object, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        allSalesReport(id) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/allSalesReport/${tenant}/${id}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForReceipt(id, receipt) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForReceiptReport/${tenant}/${id}/${receipt}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForClient(id, client) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForClientReport/${tenant}/${id}/${client}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForDate(id, fechaDesde, fechaHasta) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForDateReport/${tenant}/${id}/${fechaDesde}/${fechaHasta}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForMonth(id, year, month) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForMonthReport/${tenant}/${id}/${year}/${month}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForYear(id, year) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForYearReport/${tenant}/${id}/${year}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        allSalesGroupBy(id, type) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/allSalesGroupBy/${tenant}/${id}/${type}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForSelectedProductsAndDateRange(id, object) {
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForSelectedProductsAndDateRange/${id}`, object, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        findQuantityOfProductsSold(id, filterObject) {
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/findQuantityOfProductsSold/${id}`, filterObject, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        /******************************************************************************************************/
        /* ALL FUNCTIONS FOR STOCK REPORTS -------------------------------------------------------------------*/
        /******************************************************************************************************/
        allStocksReport(id) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/allStocksReport/${tenant}/${id}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        /******************************************************************************************************/
        /* ALL FUNCTIONS FOR Z CLOSURE REPORTS ---------------------------------------------------------------*/
        /******************************************************************************************************/
        printZClosure(object) {
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/printZClosure/${tenant}`, object, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },
    }
}