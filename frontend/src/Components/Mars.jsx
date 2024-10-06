import React from 'react';
import axios from 'axios';
import '../App.css';
import dayjs from 'dayjs';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Button from '@mui/joy/Button';
import BoxJoy from '@mui/joy/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export default class Mars extends React.Component {
    constructor() {
        super();
        this.state = {
            images: [],
            date: null,
            option: 'curiosity',
            camCuriosity: [
                { label: 'All Cameras', code: 'all' },
                { label: 'Front Hazard Avoidance Camera', code: 'FHAZ' },
                { label: 'Rear Hazard Avoidance Camera', code: 'RHAZ' },
                { label: 'Mast Camera', code: 'MAST' },
                { label: 'Chemistry and Camera Complex', code: 'CHEMCAM' },
                { label: 'Mars Hand Lens Imager', code: 'MAHLI' },
                { label: 'Mars Descent Imager', code: 'MARDI' },
                { label: 'Navigation Camera', code: 'NAVCAM' }
            ],
            camRover: [
                { label: 'All Cameras', code: 'all' },
                { label: 'Front Hazard Avoidance Camera', code: 'FHAZ' },
                { label: 'Rear Hazard Avoidance Camera', code: 'RHAZ' },
                { label: 'Navigation Camera', code: 'NAVCAM' },
                { label: 'Panoramic Camera', code: 'PANCAM' },
                { label: 'Miniature Thermal Emission Spectrometer (Mini-TES)', code: 'MINITES' }
            ],
            selectedCamera: { label: 'All Cameras', code: 'all' },
            loading: false,
        };
    }

    handleChange = (event) => {
        this.setState({
            option: event.target.value,
            selectedCamera: { label: 'All Cameras', code: 'all' }
        });
    };

    handleCameraChange = (event, newValue) => {
        this.setState({ selectedCamera: newValue });
    };

    handleDateChange = (event) => {
        this.setState({ date: event })
    }

    fetchData = async () => {
        try {
            this.setState({ loading: true });
            await axios.get('http://localhost:5000/mars', {
                params: {
                    date: dayjs(this.state.date).format('YYYY-MM-DD'),
                    option: this.state.option,
                    camera: this.state.selectedCamera.code,
                }
            }).then(res => {
                this.setState({ images: res.data.photos || [], loading: false });
            })
        } catch (error) {
            console.error(error);
            this.setState({ loading: false });
        }
    };

    render() {

        const cameraOptions = this.state.option === 'curiosity' ? this.state.camCuriosity : this.state.camRover;

        return (
            <>
                <div className='filterCenter'>
                    <FormControl style={{ margin: 'auto', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <div className='autocomplete-label' style={{ display: 'inline-block' }}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Rover</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                defaultValue="curiosity"
                                name="row-radio-buttons-group"
                                onChange={this.handleChange}>
                                <FormControlLabel value="curiosity" control={<Radio sx={{ color: 'white' }} />} label="Curiosity" />
                                <FormControlLabel value="opportunity" control={<Radio sx={{ color: 'white' }} />} label="Opportunity" />
                                <FormControlLabel value="spirit" control={<Radio sx={{ color: 'white' }} />} label="Spirit" />
                            </RadioGroup>
                        </div>
                        <Autocomplete
                            className='autocomplete-input'
                            isOptionEqualToValue={(option, value) => option.code === value?.code}
                            value={this.state.selectedCamera}
                            onChange={this.handleCameraChange}
                            options={cameraOptions}
                            getOptionLabel={(option) => option.label}
                            sx={{ width: 350, display: 'inline-block', paddingTop: '8px', color: 'white', }}
                            renderInput={(params) =>
                                <TextField {...params} InputProps={{ ...params.InputProps, style: { color: 'white' }, }}
                                    className='autocomplete-label'
                                    label="Select Camera"
                                />}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{ width: 200, display: 'inline-block', marginLeft: '15px' }}>
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
                        <BoxJoy className="componentDisplay">
                            <Button onClick={this.fetchData}>
                                Search
                            </Button>
                        </BoxJoy>
                    </FormControl>
                    {this.state.loading ? (
                        <p>Loading...</p>
                    ) : this.state.images.length > 0 ? (
                        <ImageList cols={6}>
                            {this.state.images.map((item) => (
                                <ImageListItem key={item.id}>
                                    <img
                                        style={{ height: '240px' }}
                                        src={`${item.img_src}?w=248&fit=crop&auto=format`}
                                        srcSet={`${item.img_src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        alt={item.camera.full_name}
                                        loading="lazy"
                                    />
                                    <ImageListItemBar
                                        title={<span>Camera: {item.camera.full_name}</span>}
                                        subtitle={<span>Date: {item.earth_date}</span>}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    ) : (
                        <p>No images available for the selected date and camera.</p>
                    )}
                </div>

            </>
        )
    }
}