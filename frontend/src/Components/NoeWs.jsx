import React from 'react';
import axios from 'axios';
import '../App.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import FormControl from '@mui/material/FormControl';
import dayjs from 'dayjs';
import Button from '@mui/joy/Button';
import BoxJoy from '@mui/joy/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { CardContent } from '@mui/material';
import Link from '@mui/material/Link'

export default class NeoWs extends React.Component {
    constructor() {
        super();
        this.state = {
            date: [],
            data: {},
        }
    }

    handleDateChange = (event) => {
        this.setState({ date: event })
    }

    shouldDisableDate = (date) => {
        if (this.state.date.length > 1) {
            const [start, end] = this.state.date;

            if (start) {
                const maxEndDate = dayjs(start).add(7, 'day');
                return date.isBefore(start) || date.isAfter(maxEndDate);
            }

            if (end) {
                const minStartDate = dayjs(end).subtract(7, 'day');
                return date.isBefore(minStartDate) || date.isAfter(end);
            }
            return false;
        }
        return false;

    };

    clearDate = () => {
        this.setState({ date: {} })
    }

    fetchData = async () => {
        try {
            const [start, end] = this.state.date;

            await axios.get('${process.env.API_URL}/neoWs', {
                params: {
                    startDate: dayjs(start).format('YYYY-MM-DD'),
                    endDate: dayjs(end).format('YYYY-MM-DD'),
                }
            }).then(res => {
                this.setState({ data: res.data.near_earth_objects });
            });
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        return (
            <div className='filterCenter'>
                <FormControl style={{ margin: 'auto', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateRangePicker']} sx={{ display: 'inline-block' }}>
                            <DateRangePicker
                                value={this.state.date}
                                onChange={this.handleDateChange}
                                shouldDisableDate={this.shouldDisableDate}
                                localeText={{ start: 'Start Date', end: 'End Date' }}
                                slotProps={{
                                    textField: () => ({
                                        color: 'info',
                                        focused: true,
                                        InputProps: { style: { color: 'white' }, },
                                    }),
                                }} />
                        </DemoContainer>
                    </LocalizationProvider>
                    <BoxJoy className="componentDisplay">
                        <Button onClick={this.clearDate}>Clear Filter</Button>
                    </BoxJoy>
                    <BoxJoy className="componentDisplay">
                        <Button onClick={this.fetchData}>Search Asteroids</Button>
                    </BoxJoy>
                </FormControl>

                {Object.keys(this.state.data).length > 0 ? (
                    <div style={{ marginTop: '20px' }}>
                        {Object.keys(this.state.data).map((date, index) => (
                            <Accordion
                                key={index}
                                sx={{
                                    backgroundColor: '#05070a',
                                    color: 'white',
                                    borderColor: '#185EA5',
                                    borderStyle: 'inset',
                                    marginTop: '5px'
                                }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                    aria-controls={`panel-${index}-content`}
                                    id={`panel-${index}-header`}
                                >
                                    <Typography>{date}</Typography>
                                </AccordionSummary>
                                <ImageList key={index}>
                                    <ImageListItem key={`subheader-${date}`} cols={4}>
                                    </ImageListItem>
                                    {this.state.data[date].map((neo, neoIndex) => (
                                        <ImageListItem key={neo.id} sx={{borderColor:'white', margin:'2px', borderStyle:'solid'}}>
                                            <Card sx={{ width: 350, height: 230, backgroundColor: '#05070A', color: 'white' }}>
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography sx={{ height: 70, color: 'white' }} gutterBottom variant="h5" component="div">
                                                            Name: {neo.name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                                            Diameter Max: {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                                            Diameter Min: {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} km
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                                            Is hazardous: {neo.is_potentially_hazardous_asteroid === false ? 'No' : 'Yes'}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                                            Velocity: {parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2)} km/h
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                                <CardActions>
                                                    <Link
                                                        href={neo.nasa_jpl_url}
                                                        variant="body2"
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        More Info
                                                    </Link>
                                                </CardActions>
                                            </Card>
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Accordion>
                        ))}
                    </div>
                )
                    : (<p>No NEO data available. Select a date range and search again.</p>)
                }
            </div >
        )
    }
}
