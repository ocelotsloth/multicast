FROM alpine

RUN apk --no-cache add make g++ dbus nodejs nodejs-npm python avahi avahi-compat-libdns_sd avahi-dev

ADD ./ /usr/src/multicast

RUN cd /usr/src/multicast \
  && npm install \

CMD ["node", "/usr/src/multicast"]
