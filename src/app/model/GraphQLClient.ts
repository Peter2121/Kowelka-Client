import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { Apollo, ApolloModule} from 'apollo-angular';
import { HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// const PROTOCOL = "http";
// const PORT = 8080;

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})

export class GraphQLClient {
    
    constructor(apollo : Apollo, httpLink : HttpLink) {
        const port = location.port ? ':'+location.port : '';
//        const baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/graphql`;
//        const baseUrl = `${location.protocol}://${location.hostname}:${port}/graphql`;
        const baseUrl = "/graphql";
        apollo.create({
            link: httpLink.create({ uri: baseUrl }),
            cache: new InMemoryCache()
        });
    }
    
}
