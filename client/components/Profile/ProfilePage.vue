<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>
          @{{
            $store.state.username
          }}'s donation requests and events 
        </h2>
      </header>
    </section>
    <div class="pageIntroduction">
        Welcome to your profile page! Here you can find the all the events you have hosted and requests you have made.
      </div>
    <section>
      <header>
        <h2>Events</h2>
      </header>
      <div class="right">
        <GetEventsFormBlank
          ref="getEventsFormBlank"
          value="$store.state.username"
        />
      </div>
      <section v-if="$store.state.events.length">
        <EventComponent
          v-for="event in $store.state.events"
          :key="event.id"
          :event="event"
        />
      </section>
      <article v-else>
        <h3>No events found.</h3>
      </article>
    </section>

    <section>
      <header>
        <h2>Requests</h2>
      </header>
      <div class="right">
        <GetRequestsFormBlank
          ref="getRequestsFormBlank"
          value="$store.state.username"
        />
      </div>
      <section v-if="$store.state.requests.length">
        <RequestComponent
          v-for="request in $store.state.requests"
          :key="request.id"
          :request="request"
        />
      </section>
      <article v-else>
        <h3>No requests found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import EventComponent from "@/components/Event/EventComponent.vue";
import RequestComponent from "@/components/Request/RequestComponent.vue";
import EventResponseComponent from "@/components/EventResponse/EventResponseComponent.vue";
import GetEventsFormBlank from "@/components/Event/GetEventsFormBlank.vue";
import GetRequestsFormBlank from "@/components/Request/GetRequestsFormBlank.vue";
import GetEventResponsesForm from "@/components/EventResponse/GetEventResponsesForm.vue";

export default {
  name: "ProfilePage",
  components: {
    EventComponent,
    RequestComponent,
    EventResponseComponent,
    GetEventsFormBlank,
    GetRequestsFormBlank,
    GetEventResponsesForm,
  },
  mounted() {
    this.$refs.getEventsFormBlank.submit();
    this.$refs.getRequestsFormBlank.submit();
    this.$refs.getEventResponsesForm.submit();

    console.log(this.$store);
  },
};
</script>
