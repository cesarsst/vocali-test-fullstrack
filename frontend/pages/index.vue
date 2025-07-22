<script setup lang="ts">
definePageMeta({
  title: "Home",
});
</script>

<template>
  <div class="container">
    <div class="row" style="margin-top: 40px">
      <div class="col s12 center-align">
        <h3 class="blue-text text-darken-2">
          Welcome to the Real-Time Transcription Platform
        </h3>
        <p class="grey-text text-darken-1">
          This application allows real-time speech-to-text transcription using
          modern web technologies and cloud infrastructure.
        </p>
      </div>

      <div class="col s12 m6">
        <div class="card z-depth-3">
          <div class="card-content">
            <span class="card-title">Frontend</span>
            <p>
              Built with <strong>Vue 3</strong> and <strong>Nuxt 3</strong>,
              styled using <strong>Materialize CSS</strong>. It provides an
              intuitive interface for users to sign up, log in, and start
              recording audio for transcription.
            </p>
            <p class="grey-text text-darken-1" style="margin-top: 10px">
              Key Features:
            </p>
            <ul class="browser-default">
              <li>✅ Vue + Composition API</li>
              <li>✅ Nuxt Routing and Meta system</li>
              <li>✅ Real-time WebSocket integration</li>
              <li>✅ Responsive design with Materialize</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col s12 m6">
        <div class="card z-depth-3">
          <div class="card-content">
            <span class="card-title">Backend</span>
            <p>
              The backend is a <strong>Node.js</strong> WebSocket server
              responsible for processing audio and forwarding it to the
              <strong>Speechmatics API</strong> for transcription.
            </p>
            <p class="grey-text text-darken-1" style="margin-top: 10px">
              Highlights:
            </p>
            <ul class="browser-default">
              <li>✅ Real-time audio streaming with WebSocket</li>
              <li>✅ Integration with Speechmatics for speech-to-text</li>
              <li>✅ Containerized with Docker</li>
              <li>✅ Load balancing with Nginx and upstream servers</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col s12">
        <div class="card z-depth-3">
          <div class="card-content">
            <span class="card-title">Infrastructure & Deployment</span>
            <p>
              The project uses <strong>Docker Compose</strong> to orchestrate
              containers for the frontend, backend, Nginx, and multiple
              backends. Nginx is configured to handle WebSocket traffic and
              distribute load between backend services.
            </p>
            <ul class="browser-default" style="margin-top: 10px">
              <li>✅ Dockerized architecture</li>
              <li>✅ Nginx proxy with WebSocket support</li>
              <li>
                ✅ AWS Lambda (locally emulated with Serverless Framework)
              </li>
              <li>✅ Support for Cognito authentication (sign up / sign in)</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col s12 center-align" style="margin-top: 20px">
        <router-link
          to="/dashboard"
          class="btn-large blue waves-effect waves-light"
        >
          Start Transcribing Now
        </router-link>
      </div>
    </div>
  </div>
</template>
