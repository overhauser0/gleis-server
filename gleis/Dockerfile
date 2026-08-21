FROM node:20-slim
WORKDIR /app

# docker-composeからビルド引数(ARG)として受け取る
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_KEY
ARG NEXT_PUBLIC_WS_URL

# 受け取った引数をビルド時の環境変数(ENV)としてセットする
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_KEY=$NEXT_PUBLIC_API_KEY
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

COPY package*.json ./
RUN npm install

COPY . .

# 本番ビルドを実行（本番起動時に備えて静的アセットを作る）
RUN npm run build

# 起動時のコマンドを環境変数や引数で切り替えられるようにする
# デフォルトは本番スタート
CMD ["npm", "start"]