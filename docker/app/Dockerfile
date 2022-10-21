#By Ivan Johannes
#2022

#Build with :
#tar -czh . | docker image build -t fermionnms/{{add_name_here}} -f docker/app/Dockerfile -

#Setup with :
#docker config create {{add_name_here}}-config config.js

#Test with :
#docker-compose -f docker/app/docker-compose.yml up

FROM node:16

RUN npm install -g pm2 nodemon

WORKDIR /app

#copy in the package.json first before the app files (see http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/)
COPY package*.json ./

RUN npm install


WORKDIR /app/node

#copy in the app code
COPY . .

CMD ["pm2-runtime","notify.js"]
