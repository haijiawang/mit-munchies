<template>
  <main>
    <!-- <div class="text">re-thrift is a plaform that...</div> -->
    <div class="container">
      <img
        class="container__image"
        src="https://cdn.discordapp.com/attachments/830933237168865370/1049108912487530586/re-thrift-homepage.jpeg"
      />
      <div class="container__text">
        <h2>thrifting. . . re-imagined</h2>
        <p>
          re-thrift aims to increase sustainable consumption by offering donors
          and shoppers a new way to thrift.
        </p>
        <p>
          Traditionally, thrifting involves donors donating all the items they
          no longer need or want to a vendor who markets the items to users.
          Then, shoppers spend time scouring through the donated items to see if
          there is something that matches what they were looking for. This
          process is inefficient, as shoppers have no guarantee they will find
          what they need, and donors have no guarantee that what they have
          donated will be actually sold. Instead, with re-thrift, you can create
          donation requets to specify which items you are looking for. Then,
          other app users will be able to directly respond to your requests
          should they have a matching item. Beyond individuals, re-thrift allows
          event organizers to do the same functionality to collect donation
          items for their events, whether it be a fundraiser or local thrift
          pop-up.
        </p>
        <p>
          If you are an individual, head to requests to ask others if they might
          have what you are looking for.
        </p>
        <p>
          If you are an event organizer, head to events to host an event and
          begin collection donations.
        </p>
        <p>Happy Thrifting! ☺︎</p>
        <div class="source">
          Image Source: https://www.pinterest.com/pin/285415695122035438/
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "HomePage",
  components: {},
};
</script>

<style scoped>
body {
  padding: 50px;
  background-color: #e7d2cc;
}
.container {
  padding: 20px 40px 40px;
  max-width: 15000;
}
.container__image {
  width: 500px;
  margin: 30px 30px 30px 0;
  float: left;
}
.container__text {
  display: inline;
}

.source {
  font-size: 10px;
}
</style>