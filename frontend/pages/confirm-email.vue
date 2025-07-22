<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/store/useAuthStore";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const code = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// On mount, get the email from the URL parameters
onMounted(() => {
  const emailParam = route.query.email;
  if (typeof emailParam === "string") {
    email.value = emailParam;
  } else {
    errorMessage.value = "Email not provided.";
  }
});

// Handle account confirmation
const handleConfirm = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    await auth.confirmSignup(email.value, code.value);
    successMessage.value = "Account successfully confirmed!";
    setTimeout(() => router.push("/login"), 2000);
  } catch (error) {
    console.error("Error during confirmation:", error);
    errorMessage.value = error.message || "Failed to confirm the account.";
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
              alt="Confirmation"
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
              Confirm Account
            </span>
          </div>

          <div class="card-content">
            <form @submit.prevent="handleConfirm">
              <div class="row">
                <div class="input-field col s12">
                  <label for="email" class="active">Email</label>
                  <input id="email" v-model="email" type="email" disabled />
                </div>

                <div class="input-field col s12">
                  <label for="code">Confirmation Code</label>

                  <input
                    id="code"
                    v-model="code"
                    type="text"
                    maxlength="10"
                    required
                  />
                </div>

                <div class="input-field col s12">
                  <button
                    class="btn-large green waves-effect waves-light col s12"
                    :disabled="loading"
                    style="margin-top: 10px"
                  >
                    {{ loading ? "Confirming..." : "Confirm" }}
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
              Already confirmed? Sign in
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
