---
title: "Testing NgRx"
date: "2020-05-23"
og:
  description: "Unit Testing the NgRx counter example"
  image: "https://timothycurchod.com/og/Capture-react-tdd.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## TL;DR

* Testing Ngrx using the existing code examples to fix the failing tests and use the NgRx MockStore.

The counter example from the official documents which I discussed in detail in [a previous article](https://timothycurchod.com/writings/testing-ngrx) is a good place to start with the basics of unit tests for Angular using NgRx in a monorepo using the [nx cli](https://nx.dev/angular/getting-started/why-nx).

## Testing Ngrx

[The official docs](https://ngrx.io/guide/store/testing) suggest using a Mock Store.

_The provideMockStore() function registers providers that allow you to mock out the Store for testing functionality that has a dependency on Store without setting up reducers. You can write tests validating behaviors corresponding to the specific state snapshot easily. All dispatched actions don't affect the state, but you can see them in the Actions stream._

The docs start off with testing a fictional auth component. Lets apply the mock store as shown there to the counter example.  This is a the link to the [clades repo](https://github.com/timofeysie/clades) you're interested in where the complete code samples are.

Start up the tests in a terminal:

```bash
nx test stratum --watch
```

### Fix the failing tests

After adding the counter code, we will see an error like this on first run:

```bash
● AppComponent › should render title
  Template parse errors:
  'clades-counter' is not a known element:
```

Since the app.module.ts has the CounterComponent in it's provider array, the test must also include that in it's provider array.

The next failure will then be this:

```bash
NullInjectorError: StaticInjectorError(DynamicTestModule)[CounterComponent -> Store]:
  StaticInjectorError(Platform: core)[CounterComponent -> Store]:
    NullInjectorError: No provider for Store!
```

The obvious solution would be to add Store to the imports array of the unit spec. But since the Store is used in the class constructor like this:

```TypeScript
constructor(private store: Store<{ count: number }>) {
```

The test also has to have a provider array which includes Store, like this:

```TypeScript
TestBed.configureTestingModule({
  imports: [RouterTestingModule],
  declarations: [AppComponent, CounterComponent],
  providers: [Store]
}).compileComponents();
```

However, this is not enough. After that change we will see this failure:

```bash
● AppComponent › should create the app
  NullInjectorError: StaticInjectorError(DynamicTestModule)[Store -> StateObservable]:
    StaticInjectorError(Platform: core)[Store -> StateObservable]:
      NullInjectorError: No provider for StateObservable!
```

What we need to fix this is the StoreModule.

```TypeScript
TestBed.configureTestingModule({
  imports: [RouterTestingModule, StoreModule.forRoot({})],
```

The next failure will be the new component with this message:

```bash
● CounterComponent › should create
  NullInjectorError: StaticInjectorError(DynamicTestModule)[CounterComponent -> Store]:
    StaticInjectorError(Platform: core)[CounterComponent -> Store]:
      NullInjectorError: No provider for Store!
```

Since the automatically generated test has no imports or providers array, we need to create those ourselves like this:

```TypeScript
TestBed.configureTestingModule({
  imports: [StoreModule.forRoot({})],
  declarations: [ CounterComponent ],
  providers: [Store]
})
```

Then, all of the four tests pass.

Get used to working apps but failing tests with Angular. An improvement for this headache is to create a test ngrx module that does all that and then import that in any spec file that references Store. Put this on the list of things to do.

### Using the NgRx MockStore

Now there is a clean set of passing smoke tests. They are not particularly meaningful but the default 'should create' tests will at least tell us if the template is breaking or something else breaks in the future in the class. Now it's time to write some more meaningful tests that confirm the behavior of the counter features.

Again starting with [the official NgRx testing docs](https://ngrx.io/guide/store/testing) as a guide.

Import the required libs, a MockStore object, configure the test bed with an initial state, then confirm that the initial state is what is expected.

#### **`apps\stratum\src\app\counter\counter.component.spec.ts`**

```TypeScript
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let store: MockStore;
  const initialState = { count: 0 };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [ CounterComponent ],
      providers: [Store, provideMockStore({ initialState })]
    })
    .compileComponents();
    store = TestBed.inject(MockStore);
  }));
  it('counter should start at 0',  done => {
    component.count$.subscribe( count => {
      expect(count).toEqual(0);
      done();
    });
  });
});
```

In this case, the count is 0, and we have the basics of testing a value from the store using the `done => { }` callback.

Next we will want to test the increment, decrement and reset actions. The easy path is just to set the count directly, like this:

#### **`apps\stratum\src\app\counter\counter.component.spec.ts` (partial)**

```TypeScript
it('counter should increment',  done => {
  component.count$.subscribe( count => {
    store.setState({ count: 1 });
    expect(count).toEqual(1);
    done();
  });
});
```

But really we want to test the actions, not the direct setting of the count. How do we do that? It seems like we could just do this:

```TypeScript
store.dispatch(increment());
component.count$.subscribe( count => {
  expect(count).toEqual(1);
  done();
});
```

Or put the dispatch() call inside the subscribe function? Either way, the count is 0 when we expect it to be 1. The docs show using the store.refreshState() function to updated the count, but that doesn't work either.

The testing docs show how to import a reducer, but that doesn't seem to work in this case.

```TypeScript
import * as fromAuth from './reducers';
...
let mockUsernameSelector: MemoizedSelector<fromAuth.State, string>;
```

However, don't know what fromAuth is as there is no code shown from what is being tested in the short docs.

This does not work:

```TypeScript
let mockCounterReducer: MemoizedSelector<fromCount.State, number>;
```

The TypeScript error is:

```text
Namespace '"clades/apps/stratum/src/app/store/counter.reducer"' has no exported member 'State'.ts(2694)
```

This is what is exported exported:

#### **`apps\stratum\src\app\store\counter.reducer.ts`**

```TypeScript
export function counterReducer(state, action) {
  return _counterReducer(state, action);
}
```

Using counterReducer.State instead of the fabricated fromCount.State doesn't help the sitch and the error remains the same.

Doing a little [research](https://christianlydemann.com/the-complete-guide-to-ngrx-testing/), it seems _Reducers are the easiest to test as they are pure functions, and you should simply assert that you get the right state given the provided inputs._

The sitch is that now either the 'counter should change', or the 'counter should increment' test will work, but not both at the same time. The second increment test is not actually incrementing the store value. It's strange because the second test appears to fail, but with the reported values of the _second_ test.

#### **`apps\stratum\src\app\counter\counter.component.spec.ts`(partial)**

```js
it('counter should change', done => {
  component.count$.subscribe(count => {
    store.setState({ count: 1 });
    expect(count).toEqual(1);
    done();
  });
});

it('counter should increment', done => {
  component.count$.subscribe(count => {
    counterReducer({ counter: 0 }, increment());
    expect(count).toEqual(0);
    done();
  });
});
```

The first test doesn't really help much, so we should focus on getting the increment action tested. That test actually shows this error when the value is different:

```bash
Error: Uncaught [Error: expect(received).toEqual(expected) // deep equality
```

It's not cool that just an expectation failure will look like an error with a long stack trace. It makes the results less readable and misleading. Is this an issue with a false positive? For example, if the returned value in null or undefined and the expectation code reads the value '0' as a match.

```js
expect(count).toEqual(0);
```

In any event, the following should work if the increment code works.

```js
expect(count).toEqual(1);
```

```bash
FAIL  apps/stratum/src/app/counter/counter.component.spec.ts
● Console
  console.error node_modules/jsdom/lib/jsdom/virtual-console.js:29
    Error: Uncaught [Error: expect(received).toEqual(expected) // deep equality
    Expected: 1
    Received: 0]
        at reportException (C:\Users\timof\repos\timofeysie\clades\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:62:24)
        at Timeout.callback [as _onTimeout] (C:\Users\timof\repos\timofeysie\clades\node_modules\jsdom\lib\jsdom\browser\Window.js:645:7)
        at listOnTimeout (internal/timers.js:531:17)
...
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 5 passed, 6 total
Snapshots:   0 total
Time:        5.178s
Ran all test suites.
```

Looks like a failing test not an error. What do you think? I'm not sure that the done callback code inside which we `component.count$.subscribe` is going to work with the mocked selector. It's time to detail what the docs say about this.

### Using mock selectors

The next section of the official docs on testing has this to say about selectors:

_overrideSelector() returns a MemoizedSelector. To update the mock selector to return a different value, use the MemoizedSelector's setResult() method. Updating a selector's mock value will not cause it to emit automatically. To trigger an emission from all selectors, use the MockStore.refreshState() method after updating the desired selectors._

The example code this time shows user-greeting.component.ts/.spec.ts files.

The component has this store:

```js
@Component({
  selector: 'user-greeting',
  template: `
    <div>Greetings, {{ username$ | async }}!</div>
  `,
})
export class UserGreetingComponent {
  username$ = this.store.pipe(select(fromAuth.getUsername));
```

The test mockUsernameSelector looks like this:

```js
let mockUsernameSelector: MemoizedSelector<fromAuth.State, string>;
const queryDivText = () =>
  fixture.debugElement.queryAll(By.css('div'))[0].nativeElement.textContent;
```

It would be better to use a test id, as is the norm for React tests like this:

```html
<div id="counter-test-id">Current Count: {{ count$ | async }}</div>
```

But there is no By.id, so change that id to class and that should work. If there different thing to use from @angular/platform-browser which will find by id? Another thing for the todo list (actual).

Creating our own version of the mock selector however has multiple problems:

```js
let mockCounterSelector: MemoizedSelector<counterReducer.State, string>;
```

```bash
Identifier 'mockCounterSelector' is never reassigned; use 'const' instead of 'let'. (prefer-const)tslint(1)
Cannot find namespace 'counterReducer'.ts(2503)
```

Changing the let to const doesn't help the first problem:

```bash
'const' declarations must be initialized.ts(1155)
```

The counterReducer.State we just pulled out of our nether regions, and is a more serious issue. What is our version of that demo code? Regarding the let vs. const errors, actually, that's legit. We were never giving it a value, so good call there TypeScript/VSCode. Let's look at how that's done first.

The overrideSelector API looks like this:

```js
(method) MockStore<object>.overrideSelector<any, string, string>(selector: any, value: string): MemoizedSelector<any, string, DefaultProjectorFn<string>> | MemoizedSelectorWithProps<any, any, string, DefaultProjectorFn<...>>
```

What is fromAuth? It's a selector from the reducer file.

```js
fromAuth.getUsername, 'John';
```

Because selectors are pure functions they can use an optimization technique called memoization where the selector stores the outputs in a cache, if the selector gets called again with the same input it immediately returns the cached output.

Backing up a bit. There is a simple way to test reducer actions. This is what the simplest test could look like:

```js
it('increment reducer should increment the state', () => {
  const incrementedState = counterReducer(0, increment);
  expect(incrementedState).toBe(1);
});
```

Do we need to re-use the initialState instead of the value 0? Not sure. Now, should we also be testing the way the actions are used?

```js
this.store.dispatch(increment());
```

Also, these tests for the reducers are in the counter component tests. Should these tests be moved to the store directory? I think the component tests might want to do something like snapshot testing. Is that done in Angular?  It becoming standard in the React world.

## Summary

NgRx is a powerful enterprise way to deal with complexity in large applications.
Examples of actually how to test this kind of code is less covered.  Even the official code examples wont function without some help.

I hope you enjoyed the read. Use the hashtag #TestingNgRx and the link below on [Twitter](https://twitter.com/) for any comments or feedback.
