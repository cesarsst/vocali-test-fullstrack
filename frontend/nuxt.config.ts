// nuxt.config.ts
export default defineNuxtConfig({
  devServer: {
    port: 3000,
  },
  nitro: {
    preset: "node",
  },
  ssr: false,
  css: ["materialize-css/dist/css/materialize.min.css"],
  vite: {
    define: {
      global: {},
    },
  },

  // app: {
  //   head: {
  //     script: [{ src: "/materialize.min.js", defer: true }],
  //   },
  // },
  plugins: ["~/plugins/materialize.client.ts"],
  modules: [
    "@nuxt/test-utils/module",
    "@pinia/nuxt",
    "@nuxt/image",
    "@nuxt/icon",
  ],
  runtimeConfig: {
    public: {
      NUXT_LAMBDA_FUNCTION_SIGNIN:
        process.env.NUXT_LAMBDA_FUNCTION_SIGNIN || "",
      NUXT_LAMBDA_FUNCTION_SIGNUP:
        process.env.NUXT_LAMBDA_FUNCTION_SIGNUP || "",
      NUXT_LAMBDA_FUNCTION_CONFIRM_SIGNUP:
        process.env.NUXT_LAMBDA_FUNCTION_CONFIRM_SIGNUP || "",
      NUXT_LAMBDA_FUNCTION_UPLOAD:
        process.env.NUXT_LAMBDA_FUNCTION_UPLOAD || "",
      NUXT_LAMBDA_FUNCTION_CREATE_TRANSCRIPTION:
        process.env.NUXT_LAMBDA_FUNCTION_CREATE_TRANSCRIPTION || "",
      NUXT_LAMBDA_FUNCTION_GET_TRANSCRIPTIONS:
        process.env.NUXT_LAMBDA_FUNCTION_GET_TRANSCRIPTIONS || "",
      NUXT_SPEAECH_TO_TEXT_API_KEY:
        process.env.NUXT_SPEAECH_TO_TEXT_API_KEY || "",
    },
  },
});
