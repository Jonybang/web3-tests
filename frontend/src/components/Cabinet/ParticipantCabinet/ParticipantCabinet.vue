<template>
  <div class="participant" style="padding: 10px;">
    <div>Your tokens: {{token_balance}}</div>
    <br>
    <div>Next payment: {{until_next_payment}}</div>
    <br>
    <button type="button" class="btn btn-primary" :disabled="!is_next_payment_available" @click="getPayment()">Get payment</button>
  </div>
</template>

<script src="./ParticipantCabinet.js">
</script>
