# Web Fundamentals

## What are states?

I have explained this in detail here: [What the hell is a state in web application](https://ishwar-rimal.medium.com/what-the-hell-is-state-in-web-applications-f529aa4cf6e1) Please go through it.

## Working of a browser

Majorly there are 4 events that happen when you type google.com in your browser!

1. DNS Resolution.

2. Fetching the resources.

3. Parsing and executing it.

4. Displaying the content.

Let's learn about each in brief:

## DNS Resolution

DNS Resolution is a process of converting the human-readable domain name into the numerical IP Address of your remote server.

This can happen in 3 places:

1. Browser's cache - Cached in a recent request.

2. Operating System Cache - Cached during previous lookups.

3. ISP - Internet Service Provider contains DNS resolver which has most common lookups cached.

If no resolution happens in the above 3 stages, the following steps are performed by the ISP

- Contact the root DNS servers to resolve the TLD - top-level domains (like .com, .org, .net) and get the authoritative DNS server for the top-level domain (TLD)

- Contact the TLD DNS server to resolve the authoritative DNS; The TLD DNS server responds with the IP address of the authoritative DNS server for the specific domain (e.g., google.com).

- The authoritative DNS server for the domain provides the IP address associated with the requested domain (e.g., the IP address of Google's servers). This information is sent back to the DNS resolver.

- The DNS resolver caches the IP address for future reference and sends the IP address to your web browser.

## Routing

Once the IP address is determined, and a connection is made to the server, the server decides what content to respond to based on the data present along with the IP address like port number and requested resource URL.

- Load Balancer :

The server may implement a load balancer to redirect incoming traffic to different servers.

- The server uses its routing logic to redirect the request within its system.

- The server sends the response back to the client.

- The client now processes and displays the content.

## Rendering in the browser

When the browser receives content from the server, the following steps take place (Note: we will be discussing only HTML content right here)

- **Character Encoding**: Converting the incoming binary data into a character stream. This is based on the encoding format like UTF-8 (other format ASCII, UTF8, UTF32, ISCII, Unicode)

- **Tokenizing**: Converting character stream to HTML blocks.

- **HTML Parsing**: Converting raw HTML into DOM content based on the rule of HTML specification (commonly HTML5)

- **DOM Construction**: Construct a hierarchical structure called a DOM tree with all the attributes added to the DOM node.

- **CSSOM Construction**: Similar to a DOM tree, a CSSOM tree is constructed for the CSS. (We will be covering the part of loading external CSS and external script separately)

- **Render Tree**: Another tree is constructed by combining the DOM and CSSOM. This tree consists of only the elements visible to the Actual User. Elements having styles like `display: none` etc are not part fo this tree, though it's part of the DOM Tree.

- **Layout**: Calculate the exact position and geometry of the element on the web page based on the provided styles. It determines where the element should be placed on the screen.

- **Painting**: In this phase, paint records are created, which is used by the browser to ultimately paint the elements on the screen during the compositing phase. Example of painting record: `{action: draw rect, pos: 0 0 300 300, backgroundColor: red}`

- **Compositing**: Compositing, which combines various layers or elements to create the final image, takes into account the stacking order within stacking contexts (z-index)

- **Continuous Rendering**: Browsers continuously render and update content as needed, especially for web pages with animations, scrolling, or dynamic changes. This ensures that the user sees the most up-to-date and responsive content.

If you want to learn more about this, I recommend reading this blog by Google [inside look of modern browser](https://developer.chrome.com/blog/inside-browser-part1/)

## Event Loop

When talking about Event Loop, usually the interviewer wants to know about the overall working of the JS Runtime and not just the Event Loop part of it.  
Event loop in particular is a fundamental concept that is responsible for the execution of asynchronous code by continuously checking the callback qu...(Ruko Jara, Sabar Karo) but before going deeper into that, let's first understand what is a JavaScript runtime.

## JavaScript Runtime

Runtime is nothing but an environment in which the program runs. And any environment having the capability to run a JavaScript code is a JS runtime. To understand what a JavaScript Runtime is, please read [this short article](https://ishwar-rimal.medium.com/a-javascript-runtime-what-is-it-1b3aa5514aa4)
In the context of this article, we will be discussing only about the working of JS Runtime.
A JS runtime has the following components to it:

1. Call Stack.
2. Memory Heap.
3. Web APIs.
4. Callback/Task Queue.
5. Event Loop.
6. Microtask and Promise Queue.

### CallStack

- Responsible for all the synchronous work in JavaScript.
- It is a stack data structure which operates in a Last-In-First-Out (LIFO) manner, meaning the most recently added function is the first one to be removed when it returns.
- Example:

```javascript
function functionC(){
	...
}
function functionB(){
	functionC()
	...
}
function functionA(){
	functionB()
	...
}
functionA()
```

When the above code is executed, the following happens:

1.  `functionA` is called, and it is pushed onto the call stack.
    - Call Stack: `[functionA]`
2.  `functionA` calls `functionB`, so `functionB` is added to the call stack.
    - Call Stack: `[functionA, functionB]`
3.  `functionB` calls `functionC`, so `functionC` is added to the call stack.
    - Call Stack: `[functionA, functionB, functionC]`
4.  `functionC` completes its execution and logs. It is removed from the call stack.
    - Call Stack: `[functionA, functionB]`
5.  `functionB` completes its execution and returns. It is removed from the call stack.
    - Call Stack: `[functionA]`
6.  Finally, `functionA` completes its execution and returns. It is removed from the call stack.
    - Call Stack: `[]`

### Memory Heap

- The memory heap is a region of memory where objects, variables, and function closures are allocated and stored.
- JavaScript objects are allocated in the heap, and references to these objects are managed on the stack.

### Browser API

Ever wondered how `document.getElementById` or APIs like this work in the browser?  
This is not part of the JavaScript language itself, but rather it's supported by web browsers as part of the browser's runtime environment.  
This allows JavaScript to interact with the browser and the web page's Document Object Model (DOM).

Features supported by Browser API

- DOM
- Make network requests
- Set timers
- Handle events, etc.

For the same reason, you will not be able to access DOM API in other JS Runtime like Node.

For Node, there is a separate `C++` API that helps us with things like making network calls, setting timers, etc.

### Callback Queue

The responsibility of the callback queue is to store the callback for any async tasks.
There are a series of operations that happen before any task reaches the callback queue:

1. As we read previously, web API Takes care of executing async operations.
2. Once the async execution is completed, the callback function is passed to the callback Queue.
3. The event loop continuously checks the call stack and as soon as it's empty, it moves the task in the callback queue to the call stack for execution.

As the name suggests, the callback queue is implemented using a Queue data structure, which makes sure that the first task to be passed to the queue gets executed (in this case, moved to the call stack) first.

### Event Loop

We briefly touched upon Event Loop previously [here](https://github.com/ishwarrimal/frontend-interview-preps/tree/main/Web%20Fundamentals/Basics#event-loop)
An event loop is nothing but a mechanism implemented by a JS Engine whose job is to move tasks from the callback queue to the call stack.
However, the event loop can do so only when the call stack is empty, hence event loops have to keep checking for the call stack to get empty to move the tasks from the callback queue.
NOTE: This varies slightly when it comes to the micro task queue (which is different from the callback queue), which we will read in a moment.

### Micro Task Queue

As we discussed earlier, the event loop waits for the current task on the call stack to finish before handling other queued tasks.

Typically, asynchronous operations like setTimeout use the callback queue, and those tasks are picked up only after the call stack is clear. However, in some cases, we need finer control—such as when handling API responses or promise resolutions that should be processed immediately after the current execution completes, without waiting for the entire callback queue.

This is where the microtask queue comes in. It handles tasks like Promise.then callbacks and MutationObserver callbacks, and it has higher priority than the callback queue. After the current task completes, the event loop first clears all tasks in the microtask queue before moving on to the next task from the callback queue.

This allows microtasks to run more promptly, even if other asynchronous tasks are queued up.

### Overall Execution steps:

1. First, every task (sync or async) is executed line by line, it is initiated in the call stack.
2. Functions (sync or async) are added to the call stack as they're encountered.
3. Synchronous code executes sequentially.
4. When it encounters async code like Await/Promise or setTimeout, the callback provided is registered and the operation is offloaded to the web API (or c++ API in case of Node)
5. The function that initiated the async operation is removed from the call stack.
6. The call stack continues with the other sync code if available.
7. When the async operation is completed, a callback function associated with that operation is placed in the callback queue or the microtask queue (in case of promise)
8. Event loop continuously checks for the call stack to be empty or finished expecting its current work before placing the task from the queue to the call stack.
9. The event loop continuously prioritizes the microtask queue.
10. After processing all available microtasks, the event loop checks the callback queue.
11. This process continues as long as there are tasks in either queue.
12. Once both the microtask queue and the callback queue are empty, the JavaScript program has completed its execution.

## Browser vs Other JS Runtime Environment

As we read above, not all the features that we use in our web app are provided by the language natively, rather there are external API's provided by the Browser that help us in executing those code, some of which are:

1. **DOM (Document Object Model) API**
2. **HTML5 Canvas API**
3. **Web Audio API**
4. etc.

But when it comes to Nodejs and other JS runtime, how are things like Async work and other things handled? Since there is no browser involved, who provides the support for additional work?

_Note: Node.js includes the V8 JavaScript engine, which is the same engine used by the Google Chrome web browser to execute the JS code._

Apart from the JS Engine like V8, the Runtime provides other APIs which in the case of Nodejs are C++ APIs (Nodejs is written in C++) to help run Async tasks and perform other non native works like:

1. **File System (fs) Module**
2. **HTTP Module**
3. **OS Module**
4. etc.

## Browser Storages
Web storage or browser storage is a mechanism that allows web applications to store data locally in the user's browser. 
There are two types of web storage:
1. Session Storage: used for storing data only for a single session.
2. Local Storage: used for storing data for a longer period of time.

### Session Storage
* This is used for storing data that is used only for a single session/tab.
* Typically used to store data like shopping cart data, progress in a game, etc.
* When a tab is reloaded or refreshed, the browser will create a new session for the tab.
* When the tab is duplicated, the new tab will create its own new session.
* Size is 5MB
### Local Storage
* This is used to store data for a longer period of time.
* Typically used to store data like user preferences like the preferred language.
* Size is 5MB

Things like **user credentials** are a subjective matter.  
For a highly sensitive web application, session storage is preferred as the user needs to log in on every new session, whereas, for a less sensitive application, local storage is used.

It's important to remember that this storage is provided by the browser and there is no configuration to be done by a user/developer to use this, hence it's super useful for maintaining the state of web applications.

## IndexedDB
* While web storage is good for storing a small amount of data, when there is a requirement to store a large amount of structured data, IndexedDB is preferred.
* IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
* As this data storage uses indexes, searching in this storage is faster compared to web storage.
* IndexedDB is similar to SQL-based RDBMS.
* Around 80% of your available disk size can be used for storing data.

### Points to remember while deciding the storage type

| Criteria | Web Storage  | Indexed DB
|--|--|--|
| Data Size | Small Data  | Large Data  |
|Data Structure| Key Value | Flexible |
| Retrieval | Simple and Slow | Complex query and fast
| Data Persistence | Lost when cache is cleared | Stored even for offline use
### Sync vs Async Works

Any work that stops the execution of the code and waits for it to get completed before moving to the next line of code can be called sync work.
Example

```javascript
console.log("123");
alert("Apple");
let sum = 1 + 2;
```

Whereas in the case of async work, the execution is initiated and then set aside for later, meanwhile the remaining code is executed. Once the async work is completed the execution moves back to that work.
Example:

```javascript
await makeAPICall();
makeAPICall().then().catch();
```

The browser makes use of various techniques to efficiently handle both sync and async work to fully utilise the single-threaded mechanism of JavaScript. Read more in the [JavaScript Runtime](https://github.com/ishwarrimal/frontend-interview-preps/tree/main/Web%20Fundamentals/Basics#javascript-runtime) topic above.

### JWT-based Authentication

[Read Here](https://ishwar-rimal.medium.com/decoding-the-json-web-token-aka-jwt-5b3654d0477b)

### Cookies

Cookies are small text files stored in a user's device by the web browser when they're browsing the website. Cookies typically are used to store information about the user's interaction with the website, such as login data, preferences, etc.

#### Types of Cookies
1. **Session Cookies**: These cookies are deleted when the user closes the browser. These are used to store small temporary information such as the content of the shopping cart.
2. **Persistent Cookies**: These cookies remain on the user's device until they expire or are deleted. These are used to store long-term information such as login details, etc.
3. **First-Party Cookies**: These cookies are set by the website the user is visiting. These are used to store information about the user's interaction with the page.
4. **Third-Party Cookies**: These cookies are set by third-party services, such as advertising services. It is used to track users' activity across multiple websites.
5. **Secure Cookies**: These cookies are encrypted and can be accessed only over a secure connection.
6. **HttpOnly Cookies**: These cookies are set and read only by the servers and clients have no control over them. This is mostly used to prevent XSS attacks.

#### How Cookies Work
1. When a user visits a website, it sets a cookie for the user on their device.
2. The cookie is sent to the server with information about user interaction.
3. The server uses the data in the cookie to personalize the experience for the user.

#### Cookie vulnerability
1. Cross-Site Scripting (XSS)
2. Cross-Site Request Forgery (CSRF)
3. Cookie theft.

#### Client vs Server Side (httpOnly) cookies
**Client Side Cookies** also known as JavaScript cookies are stored in the client's device and are accessed via client-side scripts. These cookies are set and retrieved using JavaScript code. These are mostly used to store details like:
1. Storing user's preferences, like language, theme or font size.
2. Tracking user's behaviour, such as click.

**Server Side Cookies** Also known as HttpOnly cookies, these are set by the server using the response header. A client-side script can not access this cookie though they are stored in the client's device. Server-side cookies are mostly used for storing authentication information.


### CORS
Cross-Origin Resource Sharing also known as CORS  is a security feature implemented in web browser to prevent web pages from making request to domains other than from where the page was loaded from. This security restriction is also known as Same Origin Policy.
This though intended to prevent security lapses, creates a problem when you're genuinely trying to access a server from a different origin for cases like API call, loading resources, etc.  
Before making an actual API call, the browser makes a **Option** or **Preflight** call to the domain to see if the request is allowed or not and based on that the further quest is made.

Key headers associated with CORS are:
1. **Acess-Control-Allow-Origin**: Defines a list of domains that are allowed to make request to the given resources.
2. **Access-Control-Allow-Methods**: Defines a list of HTTP methods that are allowed to be used while making the request.
3. **Access-Control-Allow-Headers**: Defines a list of headerst that are accepted while making the request.
4. **Access-Control-Max-Age**: specifies the maximum age of the CORS configuration
5. 


### Web Vitals:

1. **LCP (Largest Contentful Paint)**
Measures the time it takes for the largest content element (e.g. image, video, or text block) to render on the screen.  

2. **FID (First Input Delay)**
Measures the time it takes for the browser to respond to the user's first interaction (e.g. click, tap, or key press).

3. **CLS (Cumulative Layout Shift)**
Measures the sum of all layout shifts that occur on a page, affecting the user's experience and visual stability.

5. **TTFB (Time to First Byte)**
Measures the time it takes for the browser to receive the first byte of the HTML response from the server.

5. **FCP (First Contentful Paint)**
Measures the time it takes for the browser to render the first piece of content (e.g. text, image, or SVG) on the screen.

