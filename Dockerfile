FROM nginx:latest

COPY ./dist/afyia-website/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
