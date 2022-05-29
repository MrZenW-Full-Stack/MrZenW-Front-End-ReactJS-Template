FROM node:14.15.5
RUN mkdir -p /root/mrzenw_front_end_reactjs_template
WORKDIR /root/mrzenw_front_end_reactjs_template
COPY ./ /root/mrzenw_front_end_reactjs_template
# RUN apt-get install rsync -y && apt-get install openssh-client -y;
CMD pwd && \
  ls -la && \
  bash -x -e ./cicd/cicd__main.sh
