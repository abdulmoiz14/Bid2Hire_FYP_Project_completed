import React from 'react';
import { Card, CardContent, Typography, Button, IconButton } from '@mui/material';
import { Avatar, Rating } from '@mui/material';
import {Phone as PhoneIcon, Chat as ChatIcon } from '@material-ui/icons';
export default function ECommerce() {
  return (
    <div >
      <Card variant="outlined" style={{ borderRadius: '15px',
          backgroundColor: '#f1f1f1',
          width: '455px',
          margin: 'auto',
          marginTop: '5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', }}>
        <CardContent style={{ padding: '1.5rem', color: 'black' }}>
          <div>
            <Typography variant="h6" component="div">
              Cleaner
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ flexShrink: 0 }}>
              <Avatar
                style={{ width: '70px', height: '70px', border: '3px solid #000' }}
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp"
                alt="User Avatar"
              />
            </div>
            <div style={{ flexGrow: 1, marginLeft: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Typography variant="body2" component="p" style={{ fontWeight: 'bold', margin: '0', marginRight: '0.5rem' }}>
                  Laiba
                </Typography>
                <Typography variant="body1" component="p" style={{ paddingLeft:10, fontWeight: 'bold', margin: '0' }}>
                Rs 1500
              </Typography>
              </div>
              <div>
                <Rating name="read-only" value={5} size="small" readOnly />
                <IconButton color="primary" size="small" >
                    <PhoneIcon />
                </IconButton>
                <IconButton color="secondary" size="small">
                  <ChatIcon />
                </IconButton>
              </div>
            </div>
          </div>
          <hr />
          <Button variant="contained" color="primary" fullWidth>
            Hire now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
