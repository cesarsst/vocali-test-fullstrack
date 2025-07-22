<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/store/useAuthStore";

const router = useRouter();

const email = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleSignup = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    const auth = useAuthStore();
    const data = await auth.signup(
      email.value,
      password.value,
      firstName.value,
      lastName.value
    );

    console.log("data:", data);
    if (!data.success) {
      throw new Error("Erro ao cadastrar usuário");
    }

    successMessage.value = data?.data?.message || "Cadastro realizado!";
    setTimeout(
      () =>
        router.push("/confirm-email", {
          query: { email: email.value },
        }),
      2000
    );
  } catch (error) {
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
              Criar Conta
            </span>
          </div>

          <div class="card-content">
            <form @submit.prevent="handleSignup">
              <div class="row">
                <div class="input-field col s12 m6">
                  <input
                    id="firstName"
                    v-model="firstName"
                    type="text"
                    autocomplete="given-name"
                    required
                  />
                  <label for="firstName">Nome</label>
                </div>

                <div class="input-field col s12 m6">
                  <input
                    id="lastName"
                    v-model="lastName"
                    type="text"
                    autocomplete="family-name"
                    required
                  />
                  <label for="lastName">Sobrenome</label>
                </div>

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
                    autocomplete="new-password"
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
                    {{ loading ? "Enviando..." : "Cadastrar" }}
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
            <router-link to="/login" class="blue-text text-darken-2">
              Já tem uma conta? Entrar
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
