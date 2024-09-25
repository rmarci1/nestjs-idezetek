import { Controller, Get, Param, Query, Render, Search } from '@nestjs/common';
import { AppService } from './app.service';
import { quotes } from './quotes';
import { text } from 'stream/consumers';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }
  @Get('quotes')
  @Render('allquotes')
  getallqoutes() {
    return {
      quotes : quotes.quotes
    };
  }
  @Get('randomQuote')
  @Render('onequote')
  getoneqoute() {
    return {
      quotes: quotes.quotes[Math.floor(Math.random()*quotes.quotes.length)]
    };
  }
  @Get('topAuthors')
  @Render('topauthors')
  getTopauthors(){
    let quote = quotes.quotes;
    let count = {};
    let freq = Array.from({length: quote.length +1}, () => [])

    for(const n of quote){
       count[n.author] = (count[n.author] || 0) + 1;
    }
    for(const n in count){
      freq[count[n]].push(n);
    }
    return {
      authors : freq
    }
  }

  @Get('quotes/:id')
  oneQuote(@Param('id') id:string){
    let value : number = +id-1;
    return{
      Quote : quotes.quotes[value.toString()].quote
    }
  }

  @Get('deleteQuote/:id')
  DeleteQuote(@Param('id') id: string){
    let value : number = +id-1;
    if(value> quotes.quotes.length || value < 0){
      return "Ismeretlen idézet"
    }
    else{
      quotes.quotes.splice(value,1);
      console.log(quotes.quotes);
      return "sikeres törlés"
    }
  }
  @Get('kereses')
  @Render('search')
  Searchtext(@Query('text') search : string){
    let list = [];
    console.log(search);
    for (let index = 0; index < quotes.quotes.length; index++) {
      if(quotes.quotes[index].quote.includes(search)){
        console.log(quotes.quotes[index].quote);
        list.push(quotes.quotes[index].quote);
      }
    }
    return{
      quote : list
    }
  }
  @Get('authorRandomForm')
  @Render('randomform')
  RandomForm(@Query('author') authors : string){
    let list = [];
    console.log(authors)
    if(authors == undefined) return {
      idezet : ""
    }
    for (let index = 0; index < quotes.quotes.length; index++) {
      if(quotes.quotes[index].author == authors){
        list.push(quotes.quotes[index].quote);
      }
    }
    if(list.length==0) return {
      idezet : "Nincs ilyen szerző"
    }
    let random : number;
    random = Math.floor(Math.random()*list.length);
    console.log(random);
    return {
      idezet: list[random]
    }
  }
  @Get('highlight/:id')
  @Render('highlight')
  highlight(@Query('text') szovegreszlet : string, @Param('id') id: string){
      return{
        reszlet : szovegreszlet,
        quote : quotes.quotes[id]
      }
  }

}
