import { INode, INodeData, INodeParams } from '../../src/Interface'

class MenuChoiceAgent implements INode {
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
        this.label = 'Menu Choice Agent'          // 👈 Display name in UI
        this.name = 'menuChoiceAgent'             // 👈 Internal unique name
        this.type = 'AgentMenuChoice'             // 👈 Node type
        this.icon = 'fa-list-ul'                  // 👈 Different icon
        this.category = 'AgentFlow'               // 👈 Appears in AgentFlows section
        this.description = 'Presents menu choices and stores user selection'
        this.baseClasses = ['MenuChoiceAgent']
        this.version = 1

        this.inputs = [
            {
                label: 'Question',
                name: 'question',
                type: 'string',
                default: 'Please choose one option:'
            },
            {
                label: 'Choices (comma-separated)',
                name: 'choices',
                type: 'string',
                default: '1️⃣ Rooms, 2️⃣ Location, 3️⃣ Book a Room, 4️⃣ Schedule a Call'
            }
        ]

        this.outputs = [
            {
                label: 'User Selection',
                name: 'selection',
                type: 'string'
            }
        ]
    }

    async run(nodeData: INodeData): Promise<any> {
        const question = nodeData.inputs?.question as string
        const choices = (nodeData.inputs?.choices as string).split(',')
        return `${question}\n\n${choices.join('\n')}`
    }
}

module.exports = { nodeClass: MenuChoiceAgent }
                  
