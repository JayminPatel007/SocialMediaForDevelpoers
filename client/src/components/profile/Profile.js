import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getProfileById} from '../../actions/profile' 
import {Link} from "react-router-dom"

const Profile = ({getProfileById, match, profile: {profile, loading}, auth}) => {
    useEffect(()=>{
        console.log(match.params.id)
        getProfileById(match.params.id)
    }, [getProfileById, match.params.id])
    return (
        <Fragment>
            { profile === null || loading ? <h1>Wait</h1>: <Fragment>
                <Link to="/profiles" className="btn btn-light">Back</Link>
                 {auth.isAuthenticated && auth.loading === false && auth.user._id === 
                 profile.user._id && (<Link to="/edit-profile" className="btn btn-dark">Edit Profile</Link>)} 
                </Fragment>}
            <div class="profile-grid my-1"></div>
        </Fragment>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProp = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProp, {getProfileById})(Profile)
