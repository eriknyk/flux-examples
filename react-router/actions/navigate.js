module.exports = function (actionContext, payload, done) {
    console.log('Executing action: CHANGE_ROUTE');
    actionContext.dispatch('CHANGE_ROUTE', payload);
    done();
};