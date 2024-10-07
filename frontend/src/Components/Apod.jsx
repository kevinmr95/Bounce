import React from 'react';
import axios from 'axios';
import '../App.css';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/joy/Button';
import FormHelperText from '@mui/material/FormHelperText';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default class Apod extends React.Component {

  constructor() {
    super();
    this.state = {
      mensaje: [],
      date: null,
      dateFrom: null,
      count: 0,
      errorParam: false,
      errorNull: false,
      activeStep: 0,
      maxSteps: null,
      result: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleDateChange = (event) => {
    this.setState({ date: event, errorNull: false })
  }

  handleDateFromChange = (event) => {
    this.setState({ dateFrom: event, errorNull: false });
  };

  handleChange(event) {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val, errorNull: false });
  }

  handleClearDate = () => {
    this.setState({ dateFrom: null, date: null, count: 0, errorParam: false });
  };

  handleNext = () => {
    this.setState((prevState) => ({ activeStep: prevState.activeStep + 1, }));
  };

  handleBack = () => {
    this.setState((prevState) => ({ activeStep: prevState.activeStep - 1, }));
  };

  fetchData = async () => {
    try {
      let date = null;
      let dateFrom = null;
      let count = null;
      date = this.state.date != null ? date = dayjs(this.state.date).format('YYYY-MM-DD') : null;
      dateFrom = this.state.dateFrom != null ? dateFrom = dayjs(this.state.date).format('YYYY-MM-DD') : null;
      count = this.state.count > 0 ? count = this.state.count : null;

      if (date != null || dateFrom != null || count != null) {
        await axios.get(`${process.env.REACT_APP_API_URL}/apod`, {
          params: {
            date: date,
            dateFrom: dateFrom,
            count: count,
          }
        }).then(res => {
          this.setState({
            mensaje: res.data,
            maxSteps: res.data.length === undefined ? 1 : res.data.length,
            result: true
          });
        });
      } else {
        this.setState({ errorNull: true });
      }
    } catch (error) {
      this.setState({ errorParam: true })
    }
  };

  render() {
    return (
      <>
        <div className='filterCenter'>
          <FormControl style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Tooltip title={
              <>
                <div>The Specific Day option will show the best photo of the day</div>
                <div>The Date from option will show all the photos up to the current day</div>
                <div>Randomly chosen images will be returned</div>
              </>} placement="top">
              <IconButton>
                <InfoIcon sx={{ color: 'white' }}/>
              </IconButton>
            </Tooltip>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']} sx={{ width: 200 }}>
                  <DatePicker
                    label="Specific Day"
                    name="date"
                    value={this.state.date}
                    onChange={this.handleDateChange}
                    slotProps={{
                      openPickerButton: {
                        color: 'primary',
                      },
                      textField: () => ({
                        color: 'info',
                        focused: true,
                        InputProps: { style: { color: 'white' }, },
                      }),
                    }} />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div style={{ marginLeft: '15px' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangePicker']} sx={{ width: 200 }}>
                  <DatePicker
                    label="Date From"
                    name="dateFrom"
                    value={this.state.dateFrom}
                    onChange={this.handleDateFromChange}
                    slotProps={{
                      openPickerButton: {
                        color: 'primary',
                      },
                      textField: () => ({
                        color: 'info',
                        focused: true,
                        InputProps: { style: { color: 'white' }, },
                      }),
                    }} />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <Box sx={{ width: 150, marginLeft: '15px' }}>
              <Typography id="input-slider" gutterBottom>
                Random Data : {this.state.count}
              </Typography>
              <Slider
                defaultValue={60}
                valueLabelDisplay="auto"
                name="count"
                value={this.state.count}
                onChange={this.handleChange} />
            </Box>
          </FormControl>
        </div>
        <div className='filterCenter'>
          <div style={{ width: '570px', marginTop: '10px' }}>
            <div style={{ float: 'left' }}>
              <Button onClick={this.handleClearDate} sx={{ float: 'left' }}>
                Clean Filters
              </Button>
            </div>
            <div style={{ float: 'left', width: '65%' }}>
              {this.state.errorNull === true
                ? <FormHelperText style={{ textAlign: 'right', color: 'red', margin: 'revert', marginRight: '10px' }}>
                  Select a Filter!!!
                </FormHelperText> : <FormHelperText />}
              {this.state.errorParam === true
                ? <FormHelperText style={{ textAlign: 'right', color: 'red', margin: 'revert', marginRight: '10px' }}>
                  Select Only One Filter!!!
                </FormHelperText> : <FormHelperText />}
            </div>
            <div style={{ float: 'left' }}>
              <Button onClick={this.fetchData} sx={{ float: 'right' }}>
                Search
              </Button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '15px' }}>
          {this.state.result ? (
            <Box style={{ margin: 'auto', textAlign: 'center', width: '950px' }} sx={{ borderColor: '#185EA5', borderStyle: 'inset' }}>
              <Paper
                square
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 50,
                  pl: 2,
                  bgcolor: 'background.default',
                  backgroundColor: '#05070a'
                }}>
                {
                  this.state.mensaje.length > 0
                    ? <Typography sx={{ color: 'white' }}>{this.state.mensaje[this.state.activeStep].title}</Typography>
                    : <Typography sx={{ color: 'white' }}>{this.state.mensaje.title}</Typography>
                }
              </Paper>
              <Box sx={{ width: '100%', p: 2 }}>
                {this.state.mensaje.length > 0 ?
                  <div>
                    {this.state.mensaje[this.state.activeStep].media_type === "image" ?
                      <img src={this.state.mensaje[this.state.activeStep].url} alt="nasa" style={{ width: '500px', height: '500px' }} />
                      :
                      <iframe
                        width="640"
                        height="360"
                        src={this.state.mensaje[this.state.activeStep].url}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />}
                    <p>Capture Day: {this.state.mensaje[this.state.activeStep].date}</p>
                    <p>{this.state.mensaje[this.state.activeStep].explanation}</p>
                  </div>
                  :
                  <div>
                    {//only 1 data
                      this.state.mensaje.media_type === "image" ?
                        <img src={this.state.mensaje.url} alt="nasa" style={{ width: '500px', height: '500px' }} />
                        :
                        <iframe
                          width="640"
                          height="360"
                          src={this.state.mensaje.url}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />}
                    <p>Capture Day: {this.state.mensaje.date}</p>
                    <p>{this.state.mensaje.explanation}</p>
                  </div>
                }
              </Box>
              <MobileStepper
                sx={{ backgroundColor: '#05070a', color: 'white' }}
                variant="text"
                steps={this.state.maxSteps}
                position="static"
                activeStep={this.state.activeStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={this.handleNext}
                    disabled={this.state.activeStep === this.state.maxSteps - 1}>
                    Next
                    {useTheme.direction === 'rtl' ? (<KeyboardArrowLeft />) : (<KeyboardArrowRight />)}
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={this.handleBack} disabled={this.state.activeStep === 0}>
                    {useTheme.direction === 'rtl' ? (<KeyboardArrowRight />) : (<KeyboardArrowLeft />)}
                    Back
                  </Button>
                }
              />
            </Box>
          ) : (
            null
          )}
        </div>
      </>
    )
  }
};
