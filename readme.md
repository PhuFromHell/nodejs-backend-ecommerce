# nodejs-backend-ecommerce

## Khởi tạo project

```bash
ls
mkdir server.js
type nul > server.js
npm init -y

# Tạo các file cần thiết
type nul > .env
type nul > src/app.js
type nul > .gitignore

# Cài đặt Express
npm i express --save

# Chạy server
node server.js

# Middleware & tiện ích
npm i morgan --save-dev       # thư viện in ra log khi người dùng chạy một request
npm i helmet --save-dev       # bảo mật HTTP headers
npm i compression

# Chạy server với watch mode
node --watch server.js

# Database
npm install mongoose

# Biến môi trường
npm install dotenv --save-dev

# Dev tools
npm install --save-dev nodemon

# Authentication & Security
npm i bcrypt --save
npm i crypto --save
npm install jsonwebtoken

# Utilities
npm i lodash --save           # hỗ trợ get data
npm i slugify --save

ls
mkdir server.js
type nul > server.js
npm init -y
type nul > .env
type nul > src/app.js
type nul > .gitignore
npm i express --save


node server.js
npm i morgan --save-dev // thư viện in ra log khi người dùng chạy một request
npm i helmet --save-dev // dùng để
npm i compression 

node --watch server.js

npm install mongoose

npm install dotenv --save-dev

npm install --save-dev nodemon
npm i bcrypt --save
npm i crypto --save
npm install jsonwebtoken
npm i lodash --save // hỗ trợ get data
# nodejs-backend-ecommerce

npm i slugify --save
