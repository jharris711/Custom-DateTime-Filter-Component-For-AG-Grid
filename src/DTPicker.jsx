import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}))

export default forwardRef((props, ref) => {
  const classes = useStyles()
  const [selectedDate, setSelectedDate] = useState()

  function handleDateChange(d) {
    if (d) {
      d = new Date(d.target.value)
      d = moment(d).format('yyyy-MM-DDThh:mm:ss')
      setSelectedDate(d)
    } else {
      setSelectedDate(null)
    }
  }

  useEffect(props.onDateChanged, [selectedDate])

  useImperativeHandle(ref, () => {
    return {
      getDate: () => {
        return new Date(selectedDate)
      },
      setDate: (d) => {
        handleDateChange(d)
      },
    }
  })

  return (
    <>
      <form className={classes.container} noValidate>
        <TextField
          id='datetime-local'
          label=''
          type='datetime-local'
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleDateChange}
          value={selectedDate}
        />
      </form>
    </>
  )
})
