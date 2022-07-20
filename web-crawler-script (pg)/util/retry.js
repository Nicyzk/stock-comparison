const retry = (promiseFactory, retryCount) => {
    return promiseFactory()
        .then(res => res)
        .catch(error => {
            console.log('retry')
            if (retryCount <= 0) {
                throw error;
            }
            return retry(promiseFactory, retryCount - 1);
        })
}

module.exports = retry