import React, { Component } from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'

class MessagesHeader extends Component {
    render() {
        const { channelName, totalUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel } = this.props;
        return (
            <Segment clearing>
                {/* Channel Title */}
                <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
                    <span>
                        {channelName}
                        {/* Display the * icon only if it is a private channel */}
                        {!isPrivateChannel && <Icon name={"star outline"} color="black" />}
                    </span>
                    <Header.Subheader>
                        {totalUniqueUsers}
                    </Header.Subheader>
                </Header>
                {/*Channel Search Input */}
                <Header floated="right">
                    <Input
                        loading={searchLoading}
                        onChange={handleSearchChange}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages"
                    />
                </Header>
            </Segment>
        )
    }
}
export default MessagesHeader;
