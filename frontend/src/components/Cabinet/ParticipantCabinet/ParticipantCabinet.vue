<template>
  <div class="participant" style="padding: 10px;">
    <div v-if="token_balance_loaded">
      <div>Your tokens: {{token_balance}}</div>
      <br>

      <div v-if="!token_balance">
        <div v-if="participation_request_sent">
          Request confirmations: {{confirmations_count}}/{{confirms_to_participation}}
        </div>
        <button type="button" class="btn btn-primary" @click="requestParticipation()" :disabled="participation_request_sent">Request Participation</button>
      </div>

      <div v-if="token_balance">
        <div>Payment received: {{payment_received}} ETH</div>
        <div>Next payment: {{until_next_payment}}</div>
        <br>
        <button type="button" class="btn btn-primary" :disabled="!is_next_payment_available" @click="getPayment()">Get payment</button>
      </div>
    </div>

    <div v-if="!token_balance_loaded">
      Loading...
    </div>
  </div>
</template>

<script src="./ParticipantCabinet.js">
</script>
