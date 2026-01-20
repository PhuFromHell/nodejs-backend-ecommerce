'use strict';

const shopModel = require('../models/shop.model.js');
const KeyTokenService = require('./keytoken.service');
const { createTokenPair } = require('../auth/authUtils');
const bccrypt = require('bcrypt');
const crypto = require('node:crypto');
const { getInfoData } = require('../utils/index.js');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {
    
    signUp = async (name, email, password) => {
        // logic to save userData to database
        try {
            // step 1: validate data
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: '23000',// email already in use
                    message: 'Email shop already in use',
                    status: 'error'
                };
            }

            // step 2: save to db
            const passwordHash = await bccrypt.hash(password, 10);
            const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] });
            if (!newShop || !newShop._id) {
                return {
                    code: '50000',
                    message: 'Cannot create new shop account',
                    status: 'error'
                };
            }

            if (newShop) {
                // created privatgeKey and publicKey here (JWT, RSA, etc...)
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
                console.log(`publicKey: ${publicKey}`);// in ra dang chuoi PEM
                console.log(`privateKey: ${privateKey}`);// in ra dang chuoi PEM

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey,
                    privateKey: privateKey
                });
                if (!keyStore) {
                    return {
                        code: '50001',
                        message: 'keyStore error',
                        status: 'error'
                    };
                }

                // create token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
                console.log("🚀 ~ AccessService ~ tokens:", tokens)

                return {
                    code: 201,
                    message: 'Shop account created successfully',
                    status: 'success',
                    metadata: {
                        shop: getInfoData(['_id', 'name', 'email', 'password'], newShop),
                        tokens
                    }
                };
            }
            return {
                code: '200',
                metadata: null
            };

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            };
        }
    }

}

module.exports = new AccessService();