'use strict'

exports.config = {
    app_name: ['BeeHappyDEV'],
    license_key: '75f1fbba291ffd046f8d544443f1f29eFFFFNRAL',
    logging: {
        level: 'info'
    },
    allow_all_headers: true,
    attributes: {
        exclude: [
            'request.headers.cookie',
            'request.headers.authorization',
            'request.headers.proxyAuthorization',
            'request.headers.setCookie*',
            'request.headers.x*',
            'response.headers.cookie',
            'response.headers.authorization',
            'response.headers.proxyAuthorization',
            'response.headers.setCookie*',
            'response.headers.x*'
        ]
    },
    worker_threads: {
        enabled: true
    }
}