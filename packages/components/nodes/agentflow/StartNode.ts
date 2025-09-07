import { INode, INodeData, INodeParams } from '../../src/Interface'

class StartNode implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    version: number

    inputs: INodeParams[]
    outputs: INodeParams[]

    constructor() {
        this.label = 'Start Node'
        this.name = 'startNode'
        this.type = 'ChatFlow'
        this.icon = 'fa-play-circle'
        this.category = 'ChatFlow'
        this.description = 'This node acts as the entry point of the flow'
        this.baseClasses = ['StartNode']
        this.version = 1

        this.inputs = [
            {
                label: 'Welcome Message',
                name: 'welcomeMessage',
                type: 'string',
                default: '👋 Welcome to Shiv Narayan Girls PG!'
            }
        ]

        this.outputs = [
            {
                label: 'Start Output',
                name: 'startOutput',
                type: 'string'
            }
        ]
    }

    async run(nodeData: INodeData): Promise<any> {
        const welcomeMessage = nodeData.inputs?.welcomeMessage as string
        return welcomeMessage
    }
}

module.exports = { nodeClass: StartNode }
