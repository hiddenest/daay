# daay

Easy Accessible, Better Customizable, and mostly strange datepicker library for the web.



# 🚧 This project has just began, SO DO NOT USE IT!



## Motivation
I ❤️-ed [react-dates](https://github.com/airbnb/react-dates) and I was using that library very well.  
But as the time goes by, I felt some problems with react-dates:

- hard to customize (everything depends on classnames)
- hard to override functions (ex. select 7 days, after N days...)
- so many props and functions, but has an unkind documentation
- so many deprecated(or maintained) libraries

So, this project has started.



## Goals

- [ ] Move from `moment` to `dayjs` (for easy use, but open an interface for other libraries such as `date-fns`)
- [ ] Support Customization with `@emotion/react`
- [ ] Support Offsets
- [ ] Support Date Ranges (Single, Between A~B, Before N Days, After N Days)
- [ ] Kind and Warm Documentations (ex. Storybook with [ArgTypes](https://storybook.js.org/docs/react/api/argtypes), written in MDX)




## Getting Started
### Install Dependencies

`daay` has a peerDependencies,  
so please check you already installed it.

* `@emotion/react` >= `11.1.1`
* `@emotion/styled` >= `11.0.0`
* `dayjs` >= `1.9.6`
* `lodash` >= `4.17.20`
* `react` >= `17.0.1`
* `react-dom` >= `17.0.1`

## Examples
Here is the first one to get you started :)

```ts
<DatePicker />
```

The default pick option is `range`,  
so if you want to pick a single date, set `pick` as `'single'`.

```ts
<DatePicker pick='single'>
```

If there's a base start date and end date, you can write like this :-)  
(Of course, the props are all optional.)

```ts
<DatePicker
  dateFrom={dayjs('2020-02-02')}
  dateTo={dayjs('2020-11-11')}
>
```



## LICENSE

MIT Licensed.
