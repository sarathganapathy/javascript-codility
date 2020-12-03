export default {
    db: {
        dev: 'mongodb://localhost:27017/cpcDev',
        prod: 'mongodb://adminuser:123456@localhost:27017/cpcProd'
    },
    session: {
        secret: 'cpcSessionSecureCodility'
    },
    passport: {
        secret: 'cpcPassportSecure',
        jwtExpireTime: '18,000,000', //5 hours
    }
};
