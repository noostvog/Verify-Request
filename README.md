# Verify&Request

**Verify&Request** is a project for verifying and sending HTTPS requests. Sending HTTP requests happens using the Node.js request module (https://github.com/request/request). But, before actually sending the request, **Verify&Request** will first verify (at runtime) if the request satisfies all the constraints set by the API provider.

## How to use Verify&Request
Instead of using the request module, require the `verify-and-request.js` file. Currently, **Verify&Request** only supports sending GET and POST requests.

### Supply web API specifications
Requests are satisfied by collecting constraints specified in a API specification (written in OpenAPI specification). **Verify&Request** accepts a superset of OpenAPI specification: constraints on multiple parameters can be defined as well.
Per path entry, there is an extra field `x-constraints` for specifying constraints: this can be constraints over one or multiple parameters. This is an example of the `/direct_messages/show` path in the Twitter API. The last line indicates that exactly one of *screen_name* and *user_id* must be present.
```
paths:
   /direct_messages/show:
      post:
         parameters:
           - name: screen_name
             in: query
             type: string 
           - name: user_id
             in: query
             type: string
           - name: text
             in: query
             type: string
         x-constraints:
           - xor(screen_name, user_id)
```
On the top level, custom constraint definitions can be added with `x-constraint-definitions`. It is possible to add constraints on the presence, type and value of a parameter. Constraints can be combined with logical connectives. For example, the *xor* constraint is defined as follows:
```
"x-constraint-definitions": [
    "xor(f1, f2) := (present(f1) AND NOT(present(f2))) OR (NOT(present(f1)) AND present(f2))"
],
```
An example of the web API specification for the Twitter API can be found in `/api_definitions/twitter.json`. 
A web API specification is added as follows:
```
request.addDefinition(twitterDefinition);
```
### Send requests
The code snippet below shows how you can send requests. In this example, the **Verify&Request** module is imported as `request`. The method `post` expects the same parameters as the original request procedure. In addition, **Verify&Request** will check if the constraints on the parameters are satisfied. For example, the following request will result in an error because the XOR constraint imposed in *user_id* and *screen_name* is not satisfied.
```
request.post({url: "https://api.twitter.com/1.1/direct_messages/new.json", 
              /* oauth information */
              form: {user_id: 123,
                     screen_name: "user"
                     text: "Message"}}, 
            function(e,r,user){ console.log(user)});
  ```
