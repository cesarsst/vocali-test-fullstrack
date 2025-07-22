<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/store/useAuthStore";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    await auth.login(email.value, password.value);
    successMessage.value = "Login realizado com sucesso!";
    router.push("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section
    class="section"
    style="
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <div class="row" style="width: 100%">
      <div class="col s12 m10 l6 xl4 offset-m1 offset-l3 offset-xl4">
        <div class="card z-depth-3">
          <div class="card-image">
            <NuxtImg
              src="https://as1.ftcdn.net/v2/jpg/14/38/20/20/1000_F_1438202044_GeEdgMb3SqX7L30GUnsOltuEcO4KZRWY.jpg"
              alt="Nature Image"
              class="img-responsive"
            />
            <span
              class="card-title black-text"
              style="
                background: rgba(255, 255, 255, 0.8);
                padding: 6px 12px;
                border-radius: 6px;
              "
            >
              Entrar na Conta
            </span>
          </div>

          <div class="card-content">
            <form @submit.prevent="handleLogin">
              <div class="row">
                <div class="input-field col s12">
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    required
                  />
                  <label for="email">Email</label>
                </div>

                <div class="input-field col s12">
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    autocomplete="current-password"
                    required
                  />
                  <label for="password">Senha</label>
                </div>

                <div class="input-field col s12">
                  <button
                    class="btn-large blue waves-effect waves-light col s12"
                    :disabled="loading"
                    style="margin-top: 10px"
                  >
                    {{ loading ? "Entrando..." : "Entrar" }}
                  </button>
                </div>
              </div>
            </form>

            <div class="section center-align">
              <p v-if="errorMessage" class="red-text text-darken-2">
                {{ errorMessage }}
              </p>
              <p v-if="successMessage" class="green-text text-darken-2">
                {{ successMessage }}
              </p>
            </div>
          </div>

          <div class="card-action center-align">
            <router-link to="/register" class="blue-text text-darken-2">
              Não tem conta? Cadastrar-se
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
