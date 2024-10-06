import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Apod from './Components/Apod';
import Mars from './Components/Mars';
import Epic from './Components/Epic';
import NeoWs from './Components/NoeWs';
import History from './Components/History';
import Typography from '@mui/joy/Typography';
import { CssBaseline } from '@mui/material';
export class App extends React.Component {

    constructor() {
        super();
        this.state = {
            option: '1',
        };
    }

    handleChange = (event, tapOption) => {
        this.setState({ option: tapOption });
    }

    render() {
        return (
            <>
                <CssBaseline />
                <div style={{ backgroundColor: '#05070a', color: 'white' }}>
                    <Box>
                        <Typography sx={{ textAlign: 'center', margin: '20px', fontSize: '50px', color:'white' }}>Nasa</Typography>
                    </Box>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={this.state.option}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={this.handleChange} centered>
                                    <Tab sx={{ color: 'white' }} label="Astronomy Picture of the Day" value="1" />
                                    <Tab sx={{ color: 'white' }} label="Mars Rover Photos" value="2" />
                                    <Tab sx={{ color: 'white' }} label="Earth Polychromatic Imaging Camera" value="3" />
                                    <Tab sx={{ color: 'white' }} label="Near Earth Object Web Service" value="4" />
                                    <Tab sx={{ color: 'white' }} label="NASA Image and Video Library" value="5" />
                                </TabList>
                            </Box>
                            <TabPanel value="1"><Apod /></TabPanel>
                            <TabPanel value="2"><Mars /></TabPanel>
                            <TabPanel value="3"><Epic /></TabPanel>
                            <TabPanel value="4"><NeoWs /></TabPanel>
                            <TabPanel value="5"><History /></TabPanel>
                        </TabContext>
                    </Box>
                </div>

            </>
        )
    }
}