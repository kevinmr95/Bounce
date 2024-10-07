import React from 'react';
import axios from 'axios';
import '../App.css';
import dayjs from 'dayjs';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/joy/Button';
import BoxJoy from '@mui/joy/Box';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default class Epic extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            images: [],
            date: null,
            option: 'natural',
            activeStep: 0,
            maxSteps: 0,
        };
    }

    handleChange = (event) => {
        this.setState({ option: event.target.value });
    }

    handleDateChange = (event) => {
        this.setState({ date: event, error: false })
    }

    handleNext = () => {
        this.setState((prevState) => ({ activeStep: prevState.activeStep + 1, }));
    };

    handleBack = () => {
        this.setState((prevState) => ({ activeStep: prevState.activeStep - 1, }));
    };

    fetchData = async () => {
        try {
            let date = null;
            let option = null;
            date = this.state.date != null ? date = dayjs(this.state.date).format('YYYY-MM-DD') : null;
            if (date != null) {
                option = this.state.option;
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/epic`, {
                    params: {
                        date: date,
                        option: option,
                    }
                });
                this.setState({ images: response.data, maxSteps: response.data.length });
            } else {
                this.setState({ error: true })
            }
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        return (
            <div style={{ display: 'grid', placeItems: 'center' }}>
                <FormControl style={{ margin: 'auto', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <div className='autocomplete-label' style={{ display: 'inline-block' }}>
                        <FormLabel id="demo-radio-buttons-group-label">Image type</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="natural"
                            name="radio-buttons-group"
                            onChange={this.handleChange}>
                            <FormControlLabel value="natural" control={<Radio sx={{ color: 'white' }} />} label="Natural" />
                            <FormControlLabel value="enchanced" control={<Radio sx={{ color: 'white' }} />} label="Enhanced" />
                        </RadioGroup>
                    </div>
                    <LocalizationProvider style={{ display: 'inline-block' }} dateAdapter={AdapterDayjs}>
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
                    <div>
                        {this.state.error === true
                            ? <FormHelperText style={{ textAlign: 'center', color: 'red' }}>
                                Select Date!!!
                            </FormHelperText>
                            : null}
                        <BoxJoy sx={{ display: 'inline-block', marginLeft: '15px' }}>
                            <Button onClick={this.fetchData}>Fetch EPIC Images</Button>
                        </BoxJoy>
                    </div>
                </FormControl >
                <div style={{ marginTop: '15px' }}>
                    {this.state.images.length > 0 ? (
                        <Box style={{ margin: 'auto' }} sx={{ borderColor: '#185EA5', borderStyle: 'inset' }}>
                            <Box sx={{ width: '100%', p: 2 }}>
                                <img
                                    src={this.state.images[this.state.activeStep].imageUrl}
                                    alt={this.state.images[this.state.activeStep].caption}
                                    style={{ width: '500px', height: '500px' }}
                                />
                                <p>Capture Day {this.state.images[this.state.activeStep].date}</p>
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
                        <p>No images to display</p>
                    )}
                </div>
            </div >
        )
    }
}