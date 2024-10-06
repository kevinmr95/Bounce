import React from 'react';
import axios from 'axios';
import '../App.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/joy/Button';
import BoxJoy from '@mui/joy/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Modal from '@mui/material/Modal';
import Textarea from '@mui/joy/Textarea';

export default class History extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            text: '',
            image: true,
            video: true,
            audio: true,
            open: false,
        }
    }
    handleChange = (event) => {
        this.setState({ ...this.state, [event.target.name]: event.target.checked, });
    };

    handleOpen = () => {
        this.setState({ open: true })
        try {

        } catch (error) {
            console.log(error)
        }
    }
    handleClose = () => this.setState({ open: false })

    fetchData = async () => {
        try {
            await axios.get('http://localhost:5000/history', {
                params: {
                    text: this.state.text,
                    mediaType: (this.state.image ? 'image,' : '') +
                        (this.state.video ? 'video,' : '') +
                        (this.state.audio ? 'audio,' : '')
                }
            }).then(res => {
                this.setState({ data: res.data.collection.items })
            })
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        return (
            <div className='filterCenter ' >
                <FormControl style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <FormControl>
                        <FormGroup row>
                            <FormControlLabel
                                label="Images"
                                control={
                                    <Checkbox
                                        checked={this.state.image}
                                        onChange={this.handleChange}
                                        name="image"
                                        sx={{ color: '#fff' }}
                                    />
                                }
                            />
                            <FormControlLabel
                                label="Video"
                                control={
                                    <Checkbox
                                        checked={this.state.video}
                                        onChange={this.handleChange}
                                        name="video"
                                        sx={{ color: '#fff' }}
                                    />
                                }
                            />
                            <FormControlLabel
                                label="Audio"
                                control={
                                    <Checkbox
                                        checked={this.state.audio}
                                        onChange={this.handleChange}
                                        name="audio"
                                        sx={{ color: '#fff' }}
                                    />
                                }
                            />
                        </FormGroup>
                    </FormControl>
                    <Box className='componentDisplay' sx={{ width: 500, maxWidth: '100%' }}>
                        <TextField
                            fullWidth label="Search for..."
                            className='autocomplete-input'
                            value={this.state.text}
                            slotProps={{ input: { style: { color: 'white' }, }, }}
                            onChange={e => { this.setState({ text: e.target.value }); }}
                        />
                    </Box>
                    <BoxJoy className='componentDisplay' sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button onClick={this.fetchData}>
                            Search
                        </Button>
                    </BoxJoy>
                </FormControl>
                {<Grid container spacing={2}>
                    {Object.keys(this.state.data).length > 0 ? (
                        Object.keys(this.state.data).map((nasaId, index) => (
                            <Card sx={{ width: 350, }} key={index}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={this.state.data[nasaId].links[0].href}
                                    />
                                    <CardContent>
                                        <Typography style={{ height: '100px' }} gutterBottom variant="h5" component="div">
                                            {this.state.data[nasaId].data[0].title}
                                        </Typography>
                                        <Textarea
                                            sx={{ height: 80 }}
                                            color="neutral"
                                            variant="plain"
                                            maxRows={2}
                                            readOnly
                                            defaultValue={this.state.data[nasaId].data[0].description}
                                        />
                                    </CardContent>
                                </CardActionArea>
                                {this.state.data[nasaId].data[0].media_type !== 'image' ?
                                    <CardActions>
                                        <Button onClick={this.handleOpen}>Open modal</Button>
                                        <Modal
                                            open={this.state.open}
                                            onClose={this.handleClose}
                                            slotProps={{ backdrop: { style: { backgroundColor: 'transparent' }, } }}
                                        >
                                            <Box sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                bgcolor: 'background.paper',
                                                border: '2px solid blue',
                                                padding: '10px'
                                            }}>
                                                <Card>
                                                    <video
                                                        width="640"
                                                        height="360"
                                                        controls
                                                    >
                                                        <source
                                                            src={`http://images-assets.nasa.gov/video/${this.state.data[nasaId].data[0].nasa_id}/${this.state.data[nasaId].data[0].nasa_id}~small.mp4`}
                                                            type="video/mp4"
                                                        />
                                                    </video>
                                                </Card>
                                            </Box>
                                        </Modal>
                                    </CardActions>
                                    : (null)}
                            </Card>
                        ))
                    ) : (
                        <p>No hay datos de NEO disponibles. Selecciona un rango de fechas y busca nuevamente.</p>
                    )}
                </Grid>}
            </div>
        )
    }
}