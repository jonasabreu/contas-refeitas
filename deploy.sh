#! /bin/bash

echo "Building"
gradle build

echo "Copiando war"
scp -i ~/.ssh/contas.pem build/libs/*.war ubuntu@177.71.253.103:/home/ubuntu/contas.war

echo "Deploying"
ssh -i ~/.ssh/contas.pem ubuntu@177.71.253.103 "/bin/bash ~/jetty/bin/jetty.sh stop && cp ~/contas.war ~/jetty/webapps/. && /bin/bash ~/jetty/bin/jetty.sh start"
