# Custom DateTime Filter Component For AG-Grid

[DEMO ON STACK BLITZ](https://stackblitz.com/edit/custom-datetime-filter-component-for-ag-grid?file=src/DTPicker.jsx)

I use [the React version of AG-Grid](https://www.ag-grid.com/react-grid/) as the data grid for a bunch of my projects, both personal and professional. The community version comes with a ***ton*** of free features straight out of the box with well-written, easy-to-read [documentation](https://www.ag-grid.com/react-grid/).

In a recent project, I found myself in need of a date-time filter for one of my columns. Reading through the docs you see that AG-Grid provides a [date filter](https://www.ag-grid.com/react-grid/filter-date/) that works great, but it doesn't filter based on the time straight out of the box. GitHub user @gportela85 provided a [jQuery-based solution](https://github.com/ag-grid/ag-grid/issues/2233#issuecomment-765008771) in the issues section of the AG-Grid repo, but [we shouldn't be using jQuery with our React project](https://stackoverflow.com/questions/51304288/what-is-the-right-way-to-use-jquery-in-react?fbclid=IwAR1iQfEi3i-F7DmCzeLehzlwcNBKlwJwxvHtXm3W3JDV_b4ZU0k5BPN_iJA). So, what does a developer do when in need of a super-specific filter that filters all the way down to the second? They create their own, of course.

 If we take a look at the **VERY** brief [Custom Filters page](https://www.ag-grid.com/react-grid/filter-custom/) in the AG-Grid docs, we see the third option is that we can create our own custom date component and customize our own date picker. If we follow the link, we come to the interface for the Date Component that shows us both the mandatory and optional methods. Just under that, you will see the Date params object that is passed to the component in the init method. We will need to implement these methods in our app:

![AG-Grid Date Component Type Interface](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k6oqjvf4lzjf1w3krjci.png)
![AG-Grid Date Params objet interface](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ygmu7fqzoaqcymdkbl76.png)

For our Custom React DateTime Component, we are going to be utilizing React's [forwardRef](https://reactjs.org/docs/forwarding-refs.html). We'll start by setting it up like this:

### DTPicker.jsx
```javascript
import React, { forwardRef } from "react";

// Instead of passing 'params' to the init method, we will be 
// passing in 'props' and 'ref' to our component that is 
// wrapped in forwardRef:
export default forwardRef((props, ref) => {
    
    // The getGui method is satisfied by returning our 
    // DateTime picker. We will add the actual component in
    // a second, but for now we will add an empty React 
    // fragment
    return (
        <></>
    )
}
``` 

Next, let's add our initial state and a function to handle the state change:

### DTPicker.jsx
```javascript
import React, { forwardRef, useState } from "react";

export default forwardRef((props, ref) => {
    // Set up the initial state. For our purposes, we will set
    // our initial selectedDate value to null:
    const [selectedDate, setSelectedDate] = useState(null);

    // Our onChange handler:
    function handleDateChange(date) {
        // If there is a value for our DateTime filter:
        if (date) {
          date = new Date(date);
          setSelectedDate(date);
        // Else if filters have been reset or no value:
        } else {
          setSelectedDate(null);
        }
    }

    return (
        <></>
    )
}
```

Now, we have to implement the getDate and setDate methods from the mandatory methods in the interface. To do this, we are going to use React's [useImperativeHandle hook](https://reactjs.org/docs/hooks-reference.html#useimperativehandle). useImperativeHandle allows us to expose functions inside of a child component through refs. For us, the functions we want to expose would be the getDate/setDate methods and the ref we are using is the ref we passed to our component along with props. The code will look like this:

### DTPicker.jsx
```javascript
import React, { 
    forwardRef, 
    useState, 
    useImperativeHandle,
} from "react";

export default forwardRef((props, ref) => {
    ...

    // Here, we set up our useImperativeHandle hook. 
    // getDate and setDate are required by AG-Grid to 
    // sync ag-Grid's date filter value with that of 
    // our components. We will pass our ref and a callback 
    // that returns the getDate and setDate methods. Notice
    // our event handler, handleDatechange, 
    // has been passed to setDate:
    useImperativeHandle(ref, () => {
      return {
        getDate: () => {
          return selectedDate;
        },
        setDate: d => {
          handleDateChange(d);
        }
      };
    });

    return (
        <></>
    )
}
```

After we have this logic set up, we need to use React's [useEffect hook](https://reactjs.org/docs/hooks-effect.html) to watch our selectedDate and call the onDateChanged method from props (remember that we pass in props instead of params):

### DTPicker.jsx
```javascript
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";

export default forwardRef((props, ref) => {
  ...

  // Set up our useEffect hook here that watches for updates
  // to selectedDate. When it is updated, it should call
  // onDateChanged from props:
  useEffect(props.onDateChanged, [selectedDate]);

  ...

  return (
    <></>
  );
});
```

Now, comes the fun part. We need to decide what datetime picker we are going to be using as our filter's input component. There are some [great options out there](https://blog.bitsrc.io/13-react-time-and-date-pickers-for-2020-d52d88d1ca0b) but for our purposes we will be using [React-DateTime-Picker](https://github.com/wojtekmaj/react-datetime-picker#readme). This picker is super easy to use. In the root directory of your project:
```bash
npm install react-datetime-picker
```

Then, we need to import it into our component and do some simple set up:

### DTPicker.jsx
```javascript
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";

// Import our DateTimePicker:
import DateTimePicker from "react-datetime-picker";

export default forwardRef((props, ref) => {
  ...

  // The datetime picker has an onChange prop and a 
  // value prop. We pass the handleDateChange event handler to
  // onChange and selectedDate to value. I also suggest 
  // disabling the calender and clock since the filter input 
  // is very small. I have also set the maxDetail prop to
  // second so I can have for precise filtering:
  return (
    <>
      <DateTimePicker
        onChange={handleDateChange}
        value={selectedDate}
        disableCalendar={true}
        disableClock={true}
        maxDetail="second"
      />
    </>
  );
});
```

Ok, that's it for building the component, but how do we implement it into our AG-Grid? Well, if we take a look back over at the [AG-Grid docs section on how to register components](https://www.ag-grid.com/react-grid/components/#mixing-javascript-and-react), we see that we have to import our custom component and pass it to the table's frameworkComponents prop. Let's add it to our table:

### App.jsx
```javascript
...
// Import our custom DTPicker component:
import DTPicker from "./DTPicker";

const App = () => {
  ... 
  // We can pass in custom filter logic to go with our 
  // custom component here in the column definition. Simply 
  // pass your logic to the comparator in the filterParams:
  const cols = [
    ...
    {
      field: "eventTimestamp",
      headerName: "Event Timestamp",
      filter: "agDateColumnFilter",
      filterParams: {
        defaultOption: "inRange",
        comparator: function(filterLocalDate, cellValue) {
          let filterBy = filterLocalDate.getTime();
          let filterMe = cellValue.getTime();
          if (filterBy === filterMe) {
            return 0;
          }

          if (filterMe < filterBy) {
            return -1;
          }

          if (filterMe > filterBy) {
            return 1;
          }
        }
      }
    }
  ];

  // Finally, pass our custom component to our table via
  // the frameworkComponents prop:
  return (
    ...
        <AgGridReact
          ...
          frameworkComponents={{
            agDateInput: DTPicker
          }}
          ...
        />
    ...
  );
};

export default App;

```

We should now have a working DateTime filter successfully integrated into our AG-Grid. If you have a better way to do it or an improvement on this method, I would love to hear it! Thanks for reading!

---

Some resources I found helpful and I think you will too:
- [AG-Grids Custom Filters](https://www.ag-grid.com/react-grid/filter-custom/)
- [React’s useImperativeHandle made simple](https://levelup.gitconnected.com/reacts-useimperativehandle-made-simple-81035a21eef0)
- [Understanding Ref Forwarding in React](https://blog.bitsrc.io/understanding-ref-forwarding-in-react-80accd93ed74)
- [React-Datetime-Picker](https://github.com/wojtekmaj/react-datetime-picker#react-datetime-picker)
- [Next-level cell editing in ag-Grid with CRUD and React Hooks](https://blog.ag-grid.com/next-level-cell-editing-in-ag-grid-with-crud-and-react-hooks/#date-picker)