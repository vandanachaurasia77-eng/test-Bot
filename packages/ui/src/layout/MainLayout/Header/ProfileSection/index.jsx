/* eslint-disable */
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
    closeSnackbar as closeSnackbarAction,
    enqueueSnackbar as enqueueSnackbarAction,
    REMOVE_DIRTY
} from '@/store/actions'
import { exportData, stringify } from '@/utils/exportImport'
import useNotifier from '@/utils/useNotifier'

// material-ui
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    Checkbox,
    ClickAwayListener,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Stack,
    Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import { PermissionListItemButton } from '@/ui-component/button/RBACButtons'
import MainCard from '@/ui-component/cards/MainCard'
import Transitions from '@/ui-component/extended/Transitions'

// assets
import ExportingGIF from '@/assets/images/Exporting.gif'
import { IconFileExport, IconFileUpload, IconLogout, IconSettings, IconUserEdit, IconX } from '@tabler/icons-react'
import './index.css'

// API
import exportImportApi from '@/api/exportimport'

// Hooks
import useApi from '@/hooks/useApi'
import { useConfig } from '@/store/context/ConfigContext'
import { getErrorMessage } from '@/utils/errorHandler'

const dataToExport = [
    'Agentflows',
    'Agentflows V2',
    'Assistants Custom',
    'Assistants OpenAI',
    'Assistants Azure',
    'Chatflows',
    'Chat Messages',
    'Chat Feedbacks',
    'Custom Templates',
    'Document Stores',
    'Executions',
    'Tools',
    'Variables'
]

const ExportDialog = ({ show, onCancel, onExport }) => {
    const portalElement = document.getElementById('portal')
    const [selectedData, setSelectedData] = useState(dataToExport)
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        if (show) setIsExporting(false)
        return () => setIsExporting(false)
    }, [show])

    const component = show ? (
        <Dialog
            onClose={!isExporting ? onCancel : undefined}
            open={show}
            fullWidth
            maxWidth='sm'
            aria-labelledby='export-dialog-title'
        >
            <DialogTitle sx={{ fontSize: '1rem' }}>
                {!isExporting ? 'Select Data to Export' : 'Exporting..'}
            </DialogTitle>
            <DialogContent>
                {!isExporting && (
                    <Stack direction='row' sx={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 1 }}>
                        {dataToExport.map((data, index) => (
                            <FormControlLabel
                                key={index}
                                size='small'
                                control={
                                    <Checkbox
                                        color='success'
                                        checked={selectedData.includes(data)}
                                        onChange={(e) =>
                                            setSelectedData(
                                                e.target.checked
                                                    ? [...selectedData, data]
                                                    : selectedData.filter((i) => i !== data)
                                            )
                                        }
                                    />
                                }
                                label={data}
                            />
                        ))}
                    </Stack>
                )}
                {isExporting && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <img src={ExportingGIF} alt='ExportingGIF' />
                            <span>Exporting data might take a while</span>
                        </div>
                    </Box>
                )}
            </DialogContent>
            {!isExporting && (
                <DialogActions>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button
                        disabled={selectedData.length === 0}
                        variant='contained'
                        onClick={() => {
                            setIsExporting(true)
                            onExport(selectedData)
                        }}
                    >
                        Export
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}
ExportDialog.propTypes = { show: PropTypes.bool, onCancel: PropTypes.func, onExport: PropTypes.func }

const ImportDialog = ({ show }) => {
    const portalElement = document.getElementById('portal')
    const component = show ? (
        <Dialog open={show} fullWidth maxWidth='sm'>
            <DialogTitle sx={{ fontSize: '1rem' }}>Importing...</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <img src={ExportingGIF} alt='ImportingGIF' />
                        <span>Importing data might take a while</span>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    ) : null
    return createPortal(component, portalElement)
}
ImportDialog.propTypes = { show: PropTypes.bool }

// ==============================|| PROFILE MENU ||============================== //
const ProfileSection = ({ handleLogout }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const { isCloud } = useConfig()

    const [open, setOpen] = useState(false)
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [importDialogOpen, setImportDialogOpen] = useState(false)

    const anchorRef = useRef(null)
    const inputRef = useRef()
    const navigate = useNavigate()
    const currentUser = useSelector((state) => state.auth.user)
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    const importAllApi = useApi(exportImportApi.importData)
    const exportAllApi = useApi(exportImportApi.exportData)
    const prevOpen = useRef(open)

    useNotifier()
    const dispatch = useDispatch()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const handleClose = (e) => {
        if (anchorRef.current && anchorRef.current.contains(e.target)) return
        setOpen(false)
    }
    const handleToggle = () => setOpen((p) => !p)

    const fileChange = (e) => {
        if (!e.target.files) return
        const file = e.target.files[0]
        setImportDialogOpen(true)
        const reader = new FileReader()
        reader.onload = (evt) => {
            if (!evt?.target?.result) return
            importAllApi.request(JSON.parse(evt.target.result))
        }
        reader.readAsText(file)
    }
    const importAllSuccess = () => {
        setImportDialogOpen(false)
        dispatch({ type: REMOVE_DIRTY })
        enqueueSnackbar({ message: `Import All successful`, options: { variant: 'success' } })
    }
    const importAll = () => inputRef.current.click()

    const onExport = (data) => {
        const body: any = {}
        if (data.includes('Agentflows')) body.agentflow = true
        if (data.includes('Agentflows V2')) body.agentflowv2 = true
        if (data.includes('Assistants Custom')) body.assistantCustom = true
        if (data.includes('Assistants OpenAI')) body.assistantOpenAI = true
        if (data.includes('Assistants Azure')) body.assistantAzure = true
        if (data.includes('Chatflows')) body.chatflow = true
        if (data.includes('Chat Messages')) body.chat_message = true
        if (data.includes('Chat Feedbacks')) body.chat_feedback = true
        if (data.includes('Custom Templates')) body.custom_template = true
        if (data.includes('Document Stores')) body.document_store = true
        if (data.includes('Executions')) body.execution = true
        if (data.includes('Tools')) body.tool = true
        if (data.includes('Variables')) body.variable = true
        exportAllApi.request(body)
    }

    useEffect(() => {
        if (importAllApi.data) {
            importAllSuccess()
            navigate(0)
        }
    }, [importAllApi.data])
    useEffect(() => {
        if (exportAllApi.data) {
            setExportDialogOpen(false)
            try {
                const dataStr = stringify(exportData(exportAllApi.data))
                const blob = new Blob([dataStr], { type: 'application/json' })
                const dataUri = URL.createObjectURL(blob)
                const linkElement = document.createElement('a')
                linkElement.href = dataUri
                linkElement.download = exportAllApi.data.FileDefaultName
                linkElement.click()
            } catch (err) {
                enqueueSnackbar({ message: `Failed to export: ${getErrorMessage(err)}`, options: { variant: 'error' } })
            }
        }
    }, [exportAllApi.data])

    return (
        <>
            <ButtonBase ref={anchorRef} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Avatar
                    variant='rounded'
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                        '&:hover': { background: theme.palette.secondary.dark, color: theme.palette.secondary.light }
                    }}
                    onClick={handleToggle}
                >
                    <IconSettings stroke={1.5} size='1.3rem' />
                </Avatar>
            </ButtonBase>
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                transition
                disablePortal
                popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 14] } }] }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false}>
                                    <Box sx={{ p: 2 }}>
                                        <Typography component='span' variant='h4'>
                                            {isAuthenticated && currentUser ? currentUser.name : 'User'}
                                        </Typography>
                                    </Box>
                                    <PerfectScrollbar style={{ maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ p: 2 }}>
                                            <Divider />
                                            <List
                                                component='nav'
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 250,
                                                    minWidth: 200,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px'
                                                }}
                                            >
                                                <PermissionListItemButton
                                                    permissionId='workspace:export'
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    onClick={() => setExportDialogOpen(true)}
                                                >
                                                    <ListItemIcon>
                                                        <IconFileExport stroke={1.5} size='1.3rem' />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant='body2'>Export</Typography>} />
                                                </PermissionListItemButton>

                                                <PermissionListItemButton
                                                    permissionId='workspace:import'
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    onClick={importAll}
                                                >
                                                    <ListItemIcon>
                                                        <IconFileUpload stroke={1.5} size='1.3rem' />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant='body2'>Import</Typography>} />
                                                </PermissionListItemButton>

                                                <input ref={inputRef} type='file' hidden onChange={fileChange} accept='.json' />

                                                {/* ✅ Version/About menu removed */}

                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    onClick={handleLogout}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size='1.3rem' />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant='body2'>Logout</Typography>} />
                                                </ListItemButton>
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>

            <ExportDialog
                show={exportDialogOpen}
                onCancel={() => setExportDialogOpen(false)}
                onExport={onExport}
            />
            <ImportDialog show={importDialogOpen} />
        </>
    )
}
ProfileSection.propTypes = { handleLogout: PropTypes.func }
export default ProfileSection
                          
