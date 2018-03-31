<template>
  <div id="cabinet">
    <div v-if="eth_ready">
      <div class="alert alert-info" role="alert" v-if="eth_address">
        Your address: {{eth_address}}
      </div>
      <div class="alert alert-warning" role="alert" v-if="!eth_address">
        Please select account in MetaMask
      </div>

      <div class="row">
        <div class="col-md-8">
          <tabs>
            <tab title="Participant cabinet" active="true" state="participant-cabinet">
              <router-view></router-view>
            </tab>
            <tab title="Mayor cabinet" state="mayor-cabinet">
              <router-view></router-view>
            </tab>
          </tabs>
        </div>
        <div class="col-md-4">
          <h4>City contract info</h4>
          <div class="alert alert-info" role="alert">
            <b>Contract name:</b> {{contract_name}}({{contract_symbol}}) <br><br>
            <b>Total tokens:</b> {{contract_total_supply}} <br>
            <b>Tokens reserve:</b> {{contract_current_supply}} <br><br>
            <b>Payment amount:</b> {{payment_amount}} ETH<br>
            <b>Payment period:</b> {{payment_period}} hours<br><br>
            <b>Payment sent:</b> {{payment_sent}} ETH
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Cabinet.js"></script>

<style lang="scss"></style>
